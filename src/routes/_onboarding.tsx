import React from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/_onboarding')({
  component: Page,
  beforeLoad: async ({ context }) => {
    const { session } = context;
    if (session && 'user' in session && session.user) {
      throw redirect({ to: "/" });
    }
  },
})

function Page() {
  return (
    <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-full">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="/onboarding-background.jpg"
            alt="Onboarding Background"
            className="opacity-50 w-full h-full object-cover"
            sizes="100vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              A platform for enthusiasts
            </p>
          </blockquote>
        </div>
      </div>
      <div className="h-full">
      <div className="min-h-full flex items-center justify-center">
          <div className="w-full max-w-[500px] p-6 space-y-6">
            <div className="grid gap-6">
        <Outlet />
        </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="/terms"
              >
                Terms of Service
              </a>{" "}
              and
              <a
                className="underline underline-offset-4 hover:text-primary"
                href="/privacy"
              >
                {" "}
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
