import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { sendEmail } from "./send-email";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail(user.email, "Verify your email", `Click <a href="${url}">here</a> to verify your email`);
        },
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "7fd1b20a-74f2-4da3-b48a-033538d86808",
                            slug: "aivium-pro",
                        }
                    ],
                    successUrl: process.env.POLAR_SUCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal(),
            ]
        })
    ]
});