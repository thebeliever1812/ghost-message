import { Container, SendMessageForm, SuggestMessages, URLInput } from '@/components'
import { Separator } from '@/components/ui/separator'
import React, { use } from 'react'

const Ask = async ({ params }: {
    params: Promise<{ username: string }>
}) => {
    const { username } = await params

    return (
        <Container>
            <section className='mt-8 text-center'>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 ">Share Anonymously with Ghost Message</h1>
                <div className="w-full mt-5">
                    <URLInput username={username} />
                </div>
            </section>

            <Separator className="my-4" />

            <SuggestMessages />

            <SendMessageForm username={username } />
        </Container>
    )
}

export default Ask