// app/oral-history/get-started/UserCTA.tsx
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function UserCTA() {
  // dynamic, request-scoped: OK here because UserCTA is async and will suspend.
  const user = await currentUser();

  return (
    <div>
      <h3 className="text-2xl text-green-700 font-bold mt-8">
        Start Preserving Your Family’s Legacy Today
      </h3>

      <p className="ml-6 text-gray-700 leading-relaxed bg-blue-50 p-4 rounded mt-4">
        Ready to capture your family’s journey?{' '}
        {user ? (
          <Link
            href="/user/upload-videos"
            className="text-blue-600 hover:underline font-medium"
          >
            Click here
          </Link>
        ) : (
          <Link
            href="/(auth)sign-in"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in first
          </Link>
        )}
      </p>

      {!user && (
        <div className="ml-6 mt-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/sign-up"
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Sign up now
          </Link>
        </div>
      )}
    </div>
  );
}
