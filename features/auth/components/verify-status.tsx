"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerifyStatusProps {
  success: boolean;
}

export default function VerifyStatus({ success }: VerifyStatusProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });

        if (countdown === 0) {
          router.push("/login");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [success, router, countdown]);

  if (success) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='flex flex-col items-center gap-6 max-w-md w-full'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse' />
            <CheckCircle2 className='relative h-20 w-20 text-green-500 dark:text-green-400' />
          </div>
          <div className='text-center space-y-2'>
            <h1 className='text-2xl font-semibold'>Email Verified!</h1>
            <p className='text-muted-foreground'>
              Your email has been successfully verified. Redirecting you to login...
            </p>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span>
              Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
            </span>
          </div>
          <Button variant='outline' onClick={() => router.push("/login")} className='mt-2'>
            Go to Login Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='flex flex-col items-center gap-6 max-w-md w-full'>
        <div className='relative'>
          <div className='absolute inset-0 bg-destructive/20 rounded-full blur-xl' />
          <XCircle className='relative h-20 w-20 text-destructive' />
        </div>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-semibold'>Verification Failed</h1>
          <p className='text-muted-foreground'>Failed to verify. Please try again later.</p>
        </div>
        <Button variant='default' onClick={() => router.push("/login")} className='mt-2'>
          Go to Login
        </Button>
      </div>
    </div>
  );
}
