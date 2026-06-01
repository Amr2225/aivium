"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

export default function Home() {
  const trpc = useTRPC();
  // const queryClient = useQueryClient();

  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow created");
      },
      onError: (error) => {
        console.error(error);
      },
    }),
  );

  const testAi = useMutation(
    trpc.testAI.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center'>
      <Button
        onClick={() =>
          authClient.signIn.email({
            email: "amr@gmail.com",
            password: "Aa@123123",
            callbackURL: "/",
          })
        }
      >
        Sign In
      </Button>

      <Button onClick={() => testAi.mutate()} disabled={testAi.isPending}>
        Test AI
      </Button>

      <pre className='bg-neutral-100 p-4 rounded-md shadow-md border border-neutral-200'>
        {JSON.stringify(data, null, 2)}
      </pre>

      <Button
        disabled={create.isPending}
        onClick={() => {
          Sentry.logger.info("Test Logging Sentry.logger.info");
          console.log("Test Logging Console.log");
          create.mutate();
        }}
      >
        Create Workflow
      </Button>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
    </div>
  );
}
