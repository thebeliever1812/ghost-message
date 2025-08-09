"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Container } from "@/components"
import { verifySchema } from "@/schemas/verifySchema"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"

export default function VerifyCode() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params = useParams()
    const username = params.username

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    })

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, { username, userInputCode: data.code })
            toast.success(response.data.message)
            setTimeout(() => {
                router.replace('/sign-in')
            }, 1 * 1000)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container className="flex justify-center items-center">
            <div className="w-full">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl w-full text-center">Verify your Ghost Message Account</h2>
                <div className="w-full max-w-xl mx-auto mt-8 md:mt-10 p-3 lg:p-5  rounded-sm shadow-[0_0_10px_0_#ccc] flex justify-center">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full justify-center">
                                <Button type="submit" disabled={isSubmitting} >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Please wait" : "Verify"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Container>
    )
}
