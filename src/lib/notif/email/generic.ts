import { Resend } from "resend";
import { createServerFn } from "@tanstack/react-start";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = createServerFn().validator(
    (input: unknown) => {
    if (typeof input !== 'object' || input === null) {
      throw new Error('Input must be an object')
    }
    const typedInput = input as any
    if (typeof typedInput.from !== 'string') {
      throw new Error('Email must be a string')
    }
    if (typeof typedInput.to !== 'string') {
      throw new Error('Email must be a string')
    }
    if (typeof typedInput.subject !== 'string') {
      throw new Error('Subject must be a string')
    }
    if (typeof typedInput.text !== 'string') {
      throw new Error('Text must be a string')
    }
    return input as { from: string, to: string, subject: string, text: string }
  }).handler(async ({data}) => {
    const {from, to, subject, text} = data;
    await resend.emails.send({
  from,
  to,
  subject,
  html: text,
});
})