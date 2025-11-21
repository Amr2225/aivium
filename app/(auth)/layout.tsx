import { requireNoAuth } from "@/lib/auth-utils";
import Link from "next/link";
import Image from "next/image";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireNoAuth();

  return (
    <div className='bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Link href='/' className='flex items-center justify-center gap-2 font-medium text-2xl'>
          <Image src='logos/logo.svg' alt='Aivium' width={32} height={32} />
          Aivium
        </Link>
        {children}
      </div>
    </div>
  );
}
