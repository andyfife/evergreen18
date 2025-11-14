import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <div className=" mt-8 flex flex-col items-center">
      <Suspense fallback={<div>Loading...</div>}>
        {' '}
        <SignUp
          appearance={{
            baseTheme: dark,
          }}
        />
      </Suspense>
    </div>
  );
}
