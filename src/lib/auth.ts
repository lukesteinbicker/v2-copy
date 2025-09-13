import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";
import { dialect } from "./pg/connect";
import { sendEmail } from "./notif/email/generic";

export const auth = betterAuth({
  database: {
    dialect,
    type: "postgres"
  },
  emailAndPassword: {  
        enabled: true,
        sendResetPassword: async ({user, url, token}, request) => {
        await sendEmail({data: {
        from: 'V <no-reply@v.gallery>',
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      }});
    },
    },
    socialProviders: { 
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      await sendEmail({data: {
        from: 'V <no-reply@v.gallery>',
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      }});
      console.log(url); //REMOVE THIS
    },
  },
    plugins: [reactStartCookies()] //make sure this is last
});