'use client'
import { Container } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const UsernameSchema = z.object({
    username: usernameValidation
  })

  const form = useForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: ''
    }
  })

  async function onSubmit(data: z.infer<typeof UsernameSchema>) {
    setLoading(true)
    try {
      await axios.post("/api/check-username-unique", data)
      router.push(`/ask/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="flex flex-col items-center">
      <section className="text-center mt-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 ">Send Messages, Stay Invisible</h1>
        <p className="mt-2 text-base lg:text-lg text-slate-600 leading-relaxed tracking-wide">
          Send and receive anonymous messages safely. No identity, no pressure — just pure honesty.
        </p>
      </section>

      <section className="mt-10 w-full flex justify-center max-w-64 sm:max-w-96 md:max-w-md">
        <Carousel className="w-full" plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="font-semibold tracking-wide">
                      Message from Ghost
                    </CardHeader>
                    <CardContent className="flex min-h-56 md:min-h-72 items-center justify-center p-6">
                      <span className="text-2xl lg:text-4xl font-semibold">{message.content}</span>
                    </CardContent>
                    <CardFooter className="text-gray-700">
                      {message.recieved}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="mt-5 tracking-wide">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Send Anonymous Message</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-start">To: Username</AlertDialogTitle>
            </AlertDialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2 flex flex-col md:flex-row gap-4 justify-between"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter receiver's Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Continue'}</Button>
              </form>
            </Form>

            <AlertDialogFooter>
              <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </section>
    </Container>
  );
}
