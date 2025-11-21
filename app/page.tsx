import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center'>
      <pre className='bg-neutral-100 p-4 rounded-md shadow-md border border-neutral-200'>
        {JSON.stringify(data, null, 2)}
      </pre>

      <form
        action={async () => {
          "use server";
          await auth.api.signOut({
            headers: await headers(),
          });

          redirect("/login");
        }}
      >
        <Button type='submit'>Sign Out</Button>
      </form>
    </div>
  );
}
