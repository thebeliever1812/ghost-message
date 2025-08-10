'use client'
import React, { useEffect, useState } from 'react'

interface URLProps {
    username: string;
}

const URLInput: React.FC<URLProps> = ({ username }) => {

    const [userUrlLink, setUserUrlLink] = useState('')

    useEffect(() => {
        setUserUrlLink(`To: ${window.location.protocol}//${window.location.host}/ask/${username}`)
    }, [username])

    return (
        <input type='text' className="w-full break-all border border-slate-800 grow px-3 py-1.5 rounded-md" value={userUrlLink || 'To: User URL link not generated'} disabled />
    )
}

export default URLInput