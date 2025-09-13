import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "~/components/function/text/label";
import { Input } from "~/components/function/input/input";
import { cn } from "~/utils/tailwind-merge";
import BottomGradient from "~/components/function/utility/bottom-gradient";
import { Button } from "~/components/function/input/button"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/function/input/form"
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from "react";
import { signIn, signInWithGoogle } from '~/lib/auth/auth-client'

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const Route = createFileRoute('/_onboarding/login')(
  {
    component: LoginComponent,
  },
)

function LoginComponent() {
  const [status, setStatus] = useState("Submit")
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()
  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setStatus("Signing in...")
    const response = await signIn({email: data.email, password: data.password})
    console.log('Login response:', response)
    if (response.error) {
      form.setError("root.serverError", {
        type: "custom",
        message: response.error.message
      })
      setStatus("Submit")
    } else {
      setStatus("Success!")
      navigate({ to: "/" })
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
      <h2 className="font-bold text-xl text-card-foreground">Sign in</h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
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

<div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {status}
              <BottomGradient />
            </Button>

              <Button onClick={handleGoogleSignIn} type="button" className="flex-1">
                <span className="text-primary-foreground">Google</span>
                <BottomGradient />
              </Button>
          </div>

          <div className="bg-gradient-to-r from-transparent via-card-foreground to-transparent my-8 h-[1px] w-full" />
        </form>
      </Form>
      
      <Link to="/signup">
        <Button className="w-full">
          <span className="text-primary-foreground">
            Create an account
          </span>
          <BottomGradient />
        </Button>
      </Link>
    </div>
  )
}