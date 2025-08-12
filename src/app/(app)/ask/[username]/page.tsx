'use client'
import { Container, SuggestMessages, URLInput } from '@/components'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Ask = () => {
    const [isAcceptingMessages, setIsAcceptingMessages] = useState(false)
    const params = useParams<{ username: string }>()

    const { username } = params

    useEffect(() => {
        const fetchIsUserAcceptingMessages = async () => {
            try {
                const response = await axios.get(`/api/accept-messages/${username}`)
                setIsAcceptingMessages(response.data.acceptingMessages)
            } catch {
                setIsAcceptingMessages(false)
            }
        }
        if (username) {
            fetchIsUserAcceptingMessages()
        }
    }, [username])

    return (
        <Container>
            <section className='mt-8 text-center'>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 ">Share Anonymously with Ghost Message</h1>
                <div className="w-full mt-5">
                    <URLInput username={username} />
                </div>
            </section>

            <div className='mt-2 tracking-wide'>
                {isAcceptingMessages ?
                    <Badge variant="default" className='bg-[#0C642F]'>{`${username} accepting messages`}</Badge>
                    :
                    <Badge variant="destructive">{`${username} not accepting messages`}</Badge>
                }</div>


            <Separator className="my-4" />

            <SuggestMessages username={username} isAcceptingMessages={isAcceptingMessages} />
        </Container>
    )
}

export default Ask