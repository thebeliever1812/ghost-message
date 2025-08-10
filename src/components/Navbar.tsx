'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Navbar: React.FC = () => {
    const { data: session, status } = useSession()
    const user = session?.user as User


    return (
        <nav className='w-full bg-slate-950 px-3 lg:px-10 py-2 text-white flex justify-between items-center'>
            <Link href={'/'} className='flex justify-center items-center gap-0.5'>
                <div className='ghost-message-logo w-10 aspect-square relative'>
                    <Image fill objectFit='' src={'/ghost_message_logo.png'} alt='ghost-message-logo' />
                </div>
                <span className='text-base md:text-xl font-bold tracking-wider'>Ghost Message</span>
            </Link>

            <div className='flex gap-1 md:gap-3 tracking-wide'>
                {
                    status === 'authenticated' &&
                    <Link href={'/dashboard'}>
                        <Button variant={'ghost'}>
                            Dashboard
                        </Button>
                    </Link>
                }
                {
                    status === 'authenticated' ?
                        <Button variant={'secondary'} onClick={() => {
                            toast.success('Logout successful')
                            setTimeout(() => {
                                signOut()
                            }, 500)
                        }}>Log out</Button>
                        :
                        <Link href={'/sign-in'}><Button variant={'secondary'}>Sign in</Button></Link>
                }
            </div>
        </nav>
    )
}

export default Navbar