'use client'
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/models/Message'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'

interface MessageCardProps {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {
    async function handleDelteMessage() {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`)
            toast.success(response.data.message)
            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }

    return (
        <div className='w-full mt-5'>
            <Card>
                <CardContent>
                    <p>{"My message" }</p>
                </CardContent>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className='w-full max-w-20 ml-5'>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button variant="destructive" className='w-full max-w-20' onClick={handleDelteMessage}>Delete</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    )
}

export default MessageCard