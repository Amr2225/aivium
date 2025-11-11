import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default async function Home() {
  const users = await prisma.user.findMany({ include: { posts: true } });

  return (
    <div>
      <h1>Hello World</h1>
      <Button className='bg-red-500 text-white'>Test</Button>
      <div className='grid place-content-center'>
        <pre className='bg-neutral-100 p-4 rounded-md shadow-md border border-neutral-200'>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  );
}
