// components/AuthRedirectButton.tsx
'use client';

import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

type AuthRedirectButtonProps = {
  /** Where to send the user after successful sign in/up */
  redirectUrl: string;
  /** 'sign-in' or 'sign-up' */
  mode?: 'sign-in' | 'sign-up';
  label?: string;
  fullWidth?: boolean;
  className?: string;
};

export function AuthRedirectButton({
  redirectUrl,
  mode = 'sign-up',
  label,
  fullWidth = false,
  className = '',
}: AuthRedirectButtonProps) {
  const btnClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

  if (mode === 'sign-in') {
    // Use forceRedirectUrl / fallbackRedirectUrl (generic props)
    return (
      <SignInButton
        mode="modal"
        // these are the props expected on SignInButton types in most clerk versions:
        forceRedirectUrl={redirectUrl}
      >
        <Button
          className={`${btnClasses} bg-blue-600 text-white hover:bg-blue-700`}
        >
          {label ?? 'Sign In'}
        </Button>
      </SignInButton>
    );
  }

  // sign-up mode
  return (
    <SignUpButton
      mode="modal"
      // use the generic props the types expect
      forceRedirectUrl={redirectUrl}
    >
      <Button
        className={`${btnClasses} bg-blue-600 text-white hover:bg-blue-700`}
      >
        {label ?? 'Sign Up'}
      </Button>
    </SignUpButton>
  );
}
