import AskUserComponent from '@/components/Home/AskUserComponent';
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ask a Question',
    description: 'Ask and answer questions on MyApp.',
};

const Ask = () => {
    return (
        <AskUserComponent />
    )
}

export default Ask