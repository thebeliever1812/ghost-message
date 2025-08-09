import React from 'react'

interface ContainerProps {
    children: React.ReactNode;
    className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
    return (
        <div className={`w-full max-w-6xl mx-auto px-5 min-h-screen ${className}`}>
            {children}
        </div>
    )
}

export default Container