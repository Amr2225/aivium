"use server"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, subject: string, body: string) {
    await resend.emails.send({
        from: "Aivium <onboarding@resend.dev>",
        to: email,
        subject: subject,
        html: body,
    });
}