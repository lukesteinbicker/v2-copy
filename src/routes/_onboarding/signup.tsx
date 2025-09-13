import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "~/components/function/input/input";
import { cn } from "~/utils/tailwind-merge";
import BottomGradient from "~/components/function/utility/bottom-gradient";
import { Button } from "~/components/function/input/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/function/input/form"
import { useState } from "react";
import { toast } from "sonner"
import { signUp, signInWithGoogle } from '~/lib/auth/auth-client'

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().max(24),
  image: z.string(),
  });

export const Route = createFileRoute('/_onboarding/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const [status, setStatus] = useState("Submit")
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setStatus("Creating account...")
    const response = await signUp({email: data.email, password: data.password, name: data.name, image: data.image});
    if (response.error) {
      form.setError("root.serverError", {
        type: "custom",
        message: response.error.message
      })
      setStatus("Submit")
    } else {
      setStatus("Success!")
      toast.success("Account created successfully!")
    }
  }

  async function handleGoogleSignIn() {
    const response = await signInWithGoogle()
    if (response.error) {
      toast.error("Failed to sign in with Google")
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 shadow-input bg-card">
      <h2 className="font-bold text-xl text-card-foreground">Sign up</h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
      <div className="flex items-center justify-between">
      <FormField
          control={form.control}
          name="name"
          render={({ field }
          ) => (
            <FormItem className="mb-4 mr-2">
              <FormLabel className="text-primary-foreground">Name</FormLabel>
              <FormControl>
            <Input
              type="text"
              className="text-card-foreground"
              {...field}
            />
          </FormControl>
          <FormMessage />
            </FormItem>
          )}
        />
        </div>
      <FormField
          control={form.control}
          name="email"
          render={({ field }
          ) => (
            <FormItem className="mb-4">
              <FormLabel className="text-primary-foreground">Email</FormLabel>
              <FormControl>
            <Input
              type="text"
              className="text-card-foreground"
              {...field}
            />
          </FormControl>
          <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-primary-foreground">Password</FormLabel>
              <FormControl>
            <Input
              type="password"
              className="text-card-foreground"
              {...field}
            />
          </FormControl>
          <FormMessage />
            </FormItem>
          )}
        />

{form.formState.errors.root?.serverError && (
    <div className="text-destructive mb-4">
      {form.formState.errors.root.serverError.message}
    </div>
  )}

<Button type="submit">{status}
            <BottomGradient />
          </Button>

          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-card-foreground"></div>
            <span className="flex-shrink mx-4 text-card-foreground">or sign up with</span>
            <div className="flex-grow border-t border-card-foreground"></div>
          </div>

          
        </form>
      </Form>
      <div className="flex gap-4">
            <Button onClick={handleGoogleSignIn} className="w-full">
              <span className="text-primary-foreground">
                Google
              </span>
            </Button>
          </div>
    </div>
  );
}
