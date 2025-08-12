'use client'
import React, { useEffect, useState, forwardRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import { Loader2 } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import z from 'zod'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'


interface SendMessageFormProps {
    username: string;
    messageText: string;
    setMessageText: (text: string) => void;

}

const SendMessageForm = forwardRef<HTMLInputElement, SendMessageFormProps>(({ username, messageText, setMessageText }, ref) => {
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    })

    const { setValue } = form

    useEffect(() => {
        if (messageText) {
            setValue('content', messageText, { shouldValidate: true })
        }
    }, [messageText])

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSendingMessage(true)
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', { username, messageContent: data.content })
            form.reset({ content: '' })
            setMessageText('')
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        } finally {
            setIsSendingMessage(false)
        }
    }
    return (
        <section className='mt-10'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-between w-full gap-3">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className='grow'>
                                <FormControl>
                                    <Input type='text' placeholder={`Enter message for ${username}`} {...field} ref={ref} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSendingMessage}>
                        {isSendingMessage && <Loader2 className="h-4 w-4 animate-spin" />}
                        {
                            isSendingMessage ? "Sending Message" : "Send"
                        }
                    </Button>
                </form>
            </Form>
        </section>
    )
})

export default SendMessageForm 