import { Container } from '@/components'
import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
    return (
        <Container>
            <Loader className='animate-spin text-center w-full mt-10' />
        </Container>
    )
}

export default loading