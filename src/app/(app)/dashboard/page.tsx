"use client"
import { Container, MessageCard } from '@/components'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/Message'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(prev => prev.filter(message => message._id !== messageId))
    }

    const { data: session, status } = useSession()
    const username = session?.user?.username ?? ""

    const copyToClipboard = async () => {
        if (!username) {
            toast.error("Username not available")
            return
        }
        try {
            await navigator.clipboard.writeText(username)
            toast.success("Username copied")
        } catch {
            toast.error("Failed to copy Username")
        }
    }

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
        } catch {
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages ?? [])
            if (refresh) {
                toast.info('Showing latest messages')
            }
        } catch {
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session?.user) return
        fetchAcceptMessage()
        fetchMessages()
    }, [session?.user, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post("/api/accept-messages", {
                acceptMessages: !acceptMessages
            })
            // CHANGED: Optimistically update the form value
            setValue('acceptMessages', !acceptMessages)
            toast.success(response.data.message ?? "Updated")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message ?? "Failed to update setting")
        }
    }

    if (status === "loading") {
        return (
            <Container>
                <Loader className='animate-spin text-center w-full mt-10' />
            </Container>
        )
    }

    if (!session?.user) {
        return <Container className='flex gap-3 justify-center items-center'>
            <div className='w-full mt-10'>You must be log in</div>
            <Button variant={'link'}>
                Sign in
            </Button>
        </Container>
    }

    return (
        <Container>
            <div>
                <h2 className='text-2xl font-bold md:text-4xl mt-8'>User Dashboard</h2>
                <h3 className='font-semibold text-md mt-5 tracking-wide'>My Username</h3>
                <div className="flex items-center w-full justify-between">
                    <input type='text' className="w-full break-all border border-slate-800 grow px-3 py-1.5 border-r-0 rounded-md rounded-r-none" value={username || "Cannot fetch the username right now"} disabled />
                    <button
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-800 border-l-0 rounded-md rounded-l-none text-white cursor-pointer tracking-wide"
                    >
                        Copy
                    </button>
                </div>

                <div className='flex w-full justify-between items-center mt-4'>
                    <div className='flex justify-start items-center gap-2'>
                        <Switch id="accept-message"
                            {...register('acceptMessages')}
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitchLoading}
                            className='cursor-pointer'
                        />
                        <Label htmlFor="accept-message" className='tracking-wide cursor-pointer'>Accept Messages</Label>
                    </div>

                    <button className='flex items-center gap-1 cursor-pointer' onClick={() => fetchMessages(true)}>
                        <RefreshCw className={`${isLoading ? 'animate-spin' : ''} text-green-500`} /><span className='text-green-500 tracking-wide'>Refresh Messages</span>
                    </button>
                </div>

                <Separator className="my-4" />

                <div className='messages-container w-full p-3'>
                    {
                        isLoading && <Loader className='w-full mx-auto animate-spin' />
                    }
                    {
                        messages.length > 0 ?
                            (
                                messages.map((message: Message) =>
                                    <div key={message._id as string}>
                                        <MessageCard message={message} onMessageDelete={handleDeleteMessage} />
                                    </div>
                                )
                            )
                            :
                            (
                                <p className='text-xl font-semibold tracking-wide leading-relaxed'>No messages found</p>
                            )
                    }
                </div>
            </div>
        </Container>
    )
}

export default Dashboard
