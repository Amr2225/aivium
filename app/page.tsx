import ClientComp from "@/components/client";
import { Button } from "@/components/ui/button";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  // const users = await prisma.user.findMany({ include: { posts: true } });

  const users = await caller.getUsers();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div>
      <h1>Hello World</h1>
      <Button className='bg-red-500 text-white'>Test</Button>
      <div className='grid place-content-center'>
        <pre className='bg-neutral-100 p-4 rounded-md shadow-md border border-neutral-200'>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientComp />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
