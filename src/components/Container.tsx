import React from 'react'

interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className='w-full max-w-6xl mx-auto py-3 px-5'>
            {children}
        </div>
    )
}

export default Container