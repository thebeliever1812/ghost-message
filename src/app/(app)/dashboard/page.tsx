"use client"
import { Container, MessageCard } from '@/components'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/Message'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

    // CHANGED: Build baseUrl only when window is available (client) and username exists.
    // Using useMemo avoids recomputing on every render.
    const baseUrl = useMemo(() => {
        if (typeof window === "undefined") return ""
        return `${window.location.protocol}//${window.location.host}`
    }, [])

    const profileUrl = useMemo(() => {
        if (!baseUrl || !username) return ""
        return `${baseUrl}/ask/${username}`
    }, [baseUrl, username])

    const copyToClipboard = async () => {
        if (!profileUrl) {
            toast.error("Profile URL not available")
            return
        }
        try {
            await navigator.clipboard.writeText(profileUrl)
            toast.success("URL copied")
        } catch {
            toast.error("Failed to copy URL")
        }
    }

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
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
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
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
        return <div>Loading...</div>
    }

    if (!session?.user) {
        return <div>You must be logged in</div>
    }

    return (
        <Container>
            <div>
                <h2 className='text-xl font-bold md:text-3xl mt-3'>User Dashboard</h2>
                <h3 className='font-semibold text-md mt-2 tracking-wide'>My Link</h3>
                <div className="flex items-center w-full justify-between">
                    <input type='text' className="w-full break-all border border-slate-800 grow px-3 py-1.5 border-r-0 rounded-md rounded-r-none" value={profileUrl || "Profile URL not ready"} disabled />
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
                        />
                        <Label htmlFor="accept-message" className='tracking-wide'>Accept Messages</Label>
                    </div>

                    <button className='flex items-center gap-1' onClick={() => fetchMessages(true)}>
                        <RefreshCw className={`${isLoading ? 'animate-spin' : ''} text-green-500`} /><span className='text-green-500 tracking-wide'>Refresh Messages</span>
                    </button>
                </div>

                <Separator className="my-4" />

                <div className='messages-container w-full p-3'>
                    {
                        messages.length > 0 ?
                            (
                                messages.map((message: any,) =>
                                    <div key={message._id}>
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
