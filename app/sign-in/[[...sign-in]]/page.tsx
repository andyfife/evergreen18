import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="mt-8 flex flex-col items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <SignIn
          appearance={{
            baseTheme: dark,
          }}
          path="/sign-in"
        />
      </Suspense>
    </div>
  );
}
