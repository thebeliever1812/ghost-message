'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
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
import { Loader2 } from 'lucide-react'

interface MessageCardProps {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    async function handleDelteMessage() {
        setIsDeleting(true)
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`)
            toast.success(response.data.message)
            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className='w-full mt-5'>
            <Card>
                <CardTitle className='ml-5'>
                    Message from Ghost
                </CardTitle>
                <CardContent>
                    <p className='text-lg md:text-2xl tracking-wide font-semibold'>{message.content}</p>
                </CardContent>

                <div className='flex justify-between'>
                    <CardFooter>
                        <p className='text-gray-700 text-sm'>{new Date(message.createdAt).toDateString()}</p>
                    </CardFooter>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className='w-full max-w-20 mr-6'>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className=''>
                                <AlertDialogCancel className='w-full sm:max-w-20'>Cancel</AlertDialogCancel>
                                <Button variant="destructive" className='w-full sm:max-w-20' onClick={handleDelteMessage} disabled={isDeleting}>{ isDeleting ? <Loader2 className='animate-spin'/> : "Delete"}</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Card>
        </div>
    )
}

export default MessageCard