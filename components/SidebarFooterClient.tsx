// components/SidebarFooterClient.tsx
'use client';

import React from 'react';
import { SidebarFooter } from '@/components/ui/sidebar';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { NavUser } from '@/components/nav-user';
import { usePathname } from 'next/navigation';

type Props = { isSignedIn: boolean };

export const SidebarFooterClient = React.memo(function SidebarFooterClient({
  isSignedIn,
}: Props) {
  const pathname = usePathname() ?? '/';

  // Hide footer's Sign In if:
  // - we're on the sign-in or sign-up pages, OR
  // - we're on Home ("/") AND the user is not signed in (Home shows Sign Up)
  const onAuthPages =
    pathname.includes('/sign-in') || pathname.includes('/sign-up');
  const hideFooterSignIn = onAuthPages || (pathname === '/' && !isSignedIn);

  if (hideFooterSignIn) {
    // still render NavUser if signed in, otherwise render empty footer
    return (
      <SidebarFooter className="flex justify-center p-2">
        {isSignedIn ? <NavUser /> : null}
      </SidebarFooter>
    );
  }

  return (
    <SidebarFooter className="flex justify-center p-2">
      {isSignedIn ? (
        <NavUser />
      ) : (
        <div className="w-full flex items-center">
          <SignInButton
            mode="modal"
            // your redirect settings here
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
            signUpForceRedirectUrl="/"
            signUpFallbackRedirectUrl="/"
          >
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Sign in
            </Button>
          </SignInButton>
        </div>
      )}
    </SidebarFooter>
  );
});
