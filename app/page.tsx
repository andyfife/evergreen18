import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <div className="flex flex-col items-center justify-start bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Image */}
      <div className="mt-8 flex justify-center w-full">
        <div className="relative w-full max-w-5xl aspect-video">
          <Image
            src="/images/evergreen-home1.png"
            alt="Evergreen Home"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-xs"
            priority
          />
        </div>
      </div>

      {/* Text section */}
      <div className="max-w-3xl mx-auto px-4 mt-8 text-left">
        <p className="text-xl text-gray-600 leading-relaxed">
          We provide a unique opportunity for families of the Chinese Diaspora
          to preserve their immigrant experiences. This is a space where family
          members interview one another, ensuring that the narrative of their
          family's journey remains authentic and firmly in their hands. It's a
          place where families take control of their own stories, creating a
          lasting legacy for future generations.
        </p>

        {/* Show Sign Up button only if user is signed out */}
        {!signedIn && (
          <div className="flex justify-end mt-6">
            <Link href="/sign-up" passHref>
              <Button className="bg-blue-500 text-white hover:bg-blue-700">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
