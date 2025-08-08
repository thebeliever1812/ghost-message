"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Container } from "@/components"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true)
    try {
      console.log("I am here")
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email,
        password: data.password
      })
      if (!result?.ok) {
        toast.error(result?.error)
        return
      }
      toast.success("Login Successful")
      setTimeout(() => {
        router.replace('/')
      }, 500)
    } catch (error) {
      toast.error("Something went wrong! Try login again")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Container>
      <div className="w-full">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl w-full text-center mt-16">Welcome! Login to Ghost Message</h2>
        <div className="sign-up-form w-full max-w-xl mx-auto mt-8 md:mt-10 p-3 lg:p-5  rounded-sm shadow-[0_0_10px_0_#ccc]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email: example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-center">
                <Button type="submit" disabled={isSubmitting} >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Please wait" : "Sign in"}
                </Button>
              </div>
            </form>
          </Form>
          <div className="w-full flex justify-center gap-3 mt-3">
            <p>Not Registered?</p><Link href={'/sign-up'} className="text-blue-500">Sign up here</Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Signin
