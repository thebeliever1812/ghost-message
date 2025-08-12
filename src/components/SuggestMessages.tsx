'use client'
import React, { useState, useRef } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { Card, CardContent, CardHeader } from './ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import defaultMessages from '@/messages.json'
import { Loader2 } from 'lucide-react'
import SendMessageForm from './SendMessageForm'

interface SendMessageFormProps {
    username: string
    isAcceptingMessages: boolean
}

const SuggestMessages: React.FC<SendMessageFormProps> = ({ username, isAcceptingMessages }) => {
    const [aiMessages, setAiMessages] = useState<string[]>([])
    const [isLoadingAiMessages, setIsLoadingAiMessages] = useState(false)
    const [messageText, setMessageText] = useState("");

    const inputRef = useRef<HTMLInputElement>(null)

    async function fetchAiSuggesstedMessages() {
        setIsLoadingAiMessages(true)
        try {
            const response = await axios.get<ApiResponse>('/api/suggest-messages')
            const messageData = response.data.text
            const requiredMessages = messageData?.split('||')
            setAiMessages([])
            setAiMessages(requiredMessages || [])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingAiMessages(false)
        }
    }

    const handleAiMessagesClickToFill = (text: string) => {
        setMessageText(text)
        inputRef.current?.focus()
    }

    return (
        <>
            <section className='w-full mt-8 flex flex-col items-start md:items-center gap-2 md:gap-3'>
                <div className='w-full'>
                    <Card>
                        <CardHeader className='text-lg md:text-xl font-bold tracking-wide'>
                            Messages
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {
                                (aiMessages.length > 0 ? aiMessages : defaultMessages).map((message, index) => {
                                    const text = typeof message === 'string' ? message : message.content
                                    return <p key={index} className='border py-2 px-3 rounded-md tracking-wide drop-shadow-sm cursor-pointer active:scale-99 active:bg-secondary hover:scale-101 duration-300' onClick={() => handleAiMessagesClickToFill(text)} >{text}</p>
                                })
                            }
                        </CardContent>
                    </Card>
                </div>
                <Button className='tracking-wide' onClick={fetchAiSuggesstedMessages} disabled={isLoadingAiMessages}>
                    {isLoadingAiMessages && <Loader2 className="h-4 w-4 animate-spin" />}
                    {
                        isLoadingAiMessages ?
                            "Please wait"
                            :
                            "Suggest Messages from AI"
                    }
                </Button>
            </section>

            <SendMessageForm username={username} messageText={messageText} setMessageText={setMessageText} isAcceptingMessages={isAcceptingMessages} ref={inputRef} />
        </>
    )
}

export default SuggestMessages