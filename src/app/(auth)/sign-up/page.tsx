"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
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

const Signup = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasTypedUsername, setHasTypedUsername] = useState(false)

    const [debouncedUsername] = useDebounceValue(username, 500)

    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
    })

    useEffect(() => {
        const checkUsernameAvailable = async () => {
            if (!hasTypedUsername) return

            if (debouncedUsername.trim().length === 0) {
                setUsernameMessage("Name cannot be blank");
                setIsCheckingUsername(false);
                return;
            }

            setUsernameMessage('')
            try {
                const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(axiosError?.response?.data.message ?? 'Error checking username')
            } finally {
                setIsCheckingUsername(false)
            }
        }
        checkUsernameAvailable()
    }, [debouncedUsername])

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/signup`, data)
            toast.success(response.data.message)
            setTimeout(() => {
                router.push(`/verify-code/${username}`)
            }, 2 * 1000)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError?.response?.data.message ?? 'Error creating account! Try again'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container className="flex justify-center items-center">
            <div className="w-full">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl w-full text-center font-bold">Welcome! Create Ghost Message Account</h2>
                <p className="text-center mt-2 font-bold">Send Messages, Stay Invisible</p>
                <div className="sign-up-form w-full max-w-xl mx-auto mt-8 md:mt-10 p-3 lg:p-5  rounded-sm shadow-[0_0_10px_0_#ccc]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Create a username" {...field} onChange={(e) => {
                                                field.onChange(e)
                                                setUsername(e.target.value)
                                                setIsCheckingUsername(true)
                                                setHasTypedUsername(true)
                                            }} />
                                        </FormControl>
                                        <FormDescription>
                                            {isCheckingUsername
                                                ? "Checking availability..."
                                                : (
                                                    <span
                                                        className={
                                                            usernameMessage.includes("Username available")
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }
                                                    >
                                                        {usernameMessage}
                                                    </span>
                                                )}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Please wait" : "Sign up"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="w-full flex justify-center gap-3 mt-3">
                        <p>Already a user?</p><Link href={'/sign-in'} className="text-blue-500">Sign in</Link>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Signup
