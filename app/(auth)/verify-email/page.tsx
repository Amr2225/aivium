import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <Mail className='h-16 w-16 text-muted-foreground' />
        <p className='text-lg text-muted-foreground'>Please verify your email</p>
      </div>
    </div>
  );
}
