"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export default function ClientComp() {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());

  return (
    <div>
      <h1>Client Component: {users?.length}</h1>
      <div className='grid place-content-center'>
        <pre className='bg-neutral-100 p-4 rounded-md shadow-md border border-neutral-200'>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  );
}
