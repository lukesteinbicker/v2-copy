import { redirect } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react"
import { createServerFn } from "@tanstack/react-start";
import { auth } from "~/lib/auth";
import { getWebRequest } from "@tanstack/react-start/server";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL
})

// Server function for SSR - uses Better Auth's server-side session handling
export const getServerSession = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    // Get the incoming request from TanStack Start
    const request = getWebRequest();
    
    // Use Better Auth's server-side session detection via request handling
    // This leverages the same cookie parsing that the auth API endpoint uses
    const sessionResponse = await auth.api.getSession({
      headers: request?.headers || new Headers(),
    });
    
    return sessionResponse;
  } catch (error) {
    console.error('Server session error:', error);
    return { data: null, error: null };
  }
});

// Keep the original client-side getSession for client-side usage
export const getSession = createServerFn().handler(async () => {
  const session = await authClient.getSession();
  return session;
});

export const signInWithGoogle = async () => {
    const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/"
  });
  
  if (error) {
    return { error };
  }
  
  return { data };
}

export const signIn = async (input: { email: string; password: string }) => {
    const { email, password } = input
    console.log('Signing in with:', { email })
    const { data: signInData, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          redirect({ to: "/" });
        },
      },
    });
    console.log('Sign in response:', { data: signInData, error })
    return { data: signInData, error }
}

export const signUp = async (input: { email: string; password: string; name: string; image: string }) => {
    const { email, password, name, image } = input
    const { data: signUpData, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image,
      callbackURL: "/"
    });
    return { data: signUpData, error }
}

export const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect({to: "/login"});
        },
      },
    });
}

export const forgetPassword = async (input: { email: string; redirectTo: string }) => {
    const { email, redirectTo } = input
    const { data: forgetData, error } = await authClient.forgetPassword({
      email,
      redirectTo
    });
    return { data: forgetData, error }
}

export const resetPassword = async (input: { newPassword: string; token: string }) => {
    const { newPassword, token } = input
    const { data: resetData, error } = await authClient.resetPassword({
      newPassword,
      token,
    });
    return { data: resetData, error }
}
