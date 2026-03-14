import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./components/auth/logout-button";

export default async function Home() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const session = sessionCookie ? JSON.parse(sessionCookie.value) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="mt-8 w-full">
          {session ? (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Logged in as
                </p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {session.email}
                </p>
                {session.name && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {session.name}
                  </p>
                )}
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
