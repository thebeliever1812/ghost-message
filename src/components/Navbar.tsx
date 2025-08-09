'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

const Navbar: React.FC = () => {
    const { data: session, status } = useSession()
    const user = session?.user as User
    const router = useRouter()

    return (
        <nav className='w-full bg-zinc-700 px-3 lg:px-10 py-2 text-white flex gap-5 justify-between items-center'>
            <Link href={'/'} className='flex justify-center items-center gap-0.5'>
                <div className='ghost-message-logo w-10 aspect-square relative'>
                    <Image fill objectFit='' src={'/ghost_message_logo.png'} alt='ghost-message-logo' />
                </div>
                <span className='text-xl font-bold'>Ghost Message</span>
            </Link>

            <ul className=''>
                
            </ul>

            {
                ['authenticated', 'loading'].includes(status) ?
                    <Button onClick={() => {
                        toast.success('Logout successful')
                        setTimeout(() => {
                            signOut()
                        }, 500)
                    }}>Log out</Button>
                    :
                    <Link href={'/sign-in'}><Button>Sign in</Button></Link>
            }
        </nav>
    )
}

export default Navbar