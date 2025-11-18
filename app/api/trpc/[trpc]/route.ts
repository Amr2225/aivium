import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc', // This is the endpoint that will be used to make the request (Make sure to change this if you change the folder structure)
        req,
        router: appRouter,
        createContext: createTRPCContext,
    });
export { handler as GET, handler as POST };

