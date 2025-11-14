// app/api/clerk-webhook/route.ts
import { NextResponse } from 'next/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

function log(message: string, data?: unknown) {
  console.log(`[${new Date().toISOString()}] WEBHOOK: ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

// robust conversion: handles epoch seconds, epoch ms, ISO, or numeric strings
function toDateSafe(v: unknown): Date | null {
  if (v === null || v === undefined) return null;

  // numeric or numeric-string?
  const n =
    typeof v === 'number'
      ? v
      : typeof v === 'string' && /^[0-9]+$/.test(v)
      ? Number(v)
      : NaN;

  if (!Number.isNaN(n)) {
    // < 1e12 → seconds; >= 1e12 → ms
    const ms = n < 1e12 ? n * 1000 : n;
    const d = new Date(ms);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  // ISO-ish strings
  const d = new Date(v as any);
  return Number.isFinite(d.getTime()) ? d : null;
}

export async function POST(req: Request) {
  log('=== WEBHOOK REQUEST START ===', { url: req.url });

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    log('ERROR: Webhook secret missing');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const headers = req.headers;
  const svixHeaders = {
    'svix-id': headers.get('svix-id'),
    'svix-timestamp': headers.get('svix-timestamp'),
    'svix-signature': headers.get('svix-signature'),
  } as WebhookRequiredHeaders;

  if (
    !svixHeaders['svix-id'] ||
    !svixHeaders['svix-timestamp'] ||
    !svixHeaders['svix-signature']
  ) {
    log('ERROR: Missing Svix headers');
    return NextResponse.json(
      { error: 'Missing required webhook headers' },
      { status: 400 }
    );
  }

  try {
    const rawBody = await req.text();
    const wh = new Webhook(secret);
    const payload: any = wh.verify(rawBody, svixHeaders);

    const clerkId: string | undefined = payload?.data?.id;
    if (!clerkId) {
      log('ERROR: Missing user ID in payload');
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    const createdAt = toDateSafe(payload.data.created_at) ?? new Date();
    const updatedAt = toDateSafe(payload.data.updated_at) ?? new Date();
    const lastSignInAt = toDateSafe(payload.data.last_sign_in_at);

    const primaryEmail =
      payload.data.email_addresses?.find(
        (e: any) => e.id === payload.data.primary_email_address_id
      )?.email_address ||
      payload.data.email_addresses?.[0]?.email_address ||
      null;

    const fullName =
      [
        payload.data.first_name?.trim() || '',
        payload.data.last_name?.trim() || '',
      ]
        .filter(Boolean)
        .join(' ') || null;

    // createData enforces id === user_id (your requirement)
    const createData = {
      id: clerkId, // PK
      user_id: clerkId, // unique external id
      email_address: primaryEmail,
      first_name: payload.data.first_name || null,
      last_name: payload.data.last_name || null,
      image_url: payload.data.image_url || null,
      object: payload.data.object ?? null,
      password_enabled: !!payload.data.password_enabled,
      primary_email_address_id: payload.data.primary_email_address_id || null,
      profile_image_url: payload.data.profile_image_url || null,
      username: payload.data.username || null,
      last_sign_in_at: lastSignInAt,
      role: UserRole.USER,
      isActive: true,
      createdAt,
      updatedAt,
      status: 'active',

      banned: !!payload.data.banned,
      primary_phone_number_id: payload.data.primary_phone_number_id || null,
      name: fullName,
      two_factor_enabled: !!payload.data.two_factor_enabled,
      unreadMessageCount: 0,
    };

    // updateData avoids clobbering wallet fields
    const updateData = {
      email_address: primaryEmail,
      first_name: payload.data.first_name || null,
      last_name: payload.data.last_name || null,
      image_url: payload.data.image_url || null,
      object: payload.data.object ?? null,
      password_enabled: !!payload.data.password_enabled,
      primary_email_address_id: payload.data.primary_email_address_id || null,
      profile_image_url: payload.data.profile_image_url || null,
      username: payload.data.username || null,
      last_sign_in_at: lastSignInAt,
      role: UserRole.USER,
      isActive: true,
      updatedAt,
      status: 'active',
      banned: !!payload.data.banned,
      primary_phone_number_id: payload.data.primary_phone_number_id || null,
      name: fullName,
      two_factor_enabled: !!payload.data.two_factor_enabled,
      // do NOT touch: hasWallet, walletName, encryptedMnemonic, primaryWeb3WalletId, qrCodeUrl
    };

    const user = await prisma.user.upsert({
      where: { user_id: clerkId },
      create: createData,
      update: updateData,
      select: { user_id: true, email_address: true },
    });

    log(`User upserted: ${user.user_id}`);
    return NextResponse.json(
      {
        success: true,
        message: 'User processed successfully',
        user_id: user.user_id,
        email: user.email_address,
      },
      { status: 200 }
    );
  } catch (error: any) {
    log('ERROR:', { message: error?.message, stack: error?.stack });
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error?.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }

  // IMPORTANT: do NOT prisma.$disconnect() here
}
