import SignUpComponent from "@/components/Auth/SignUpComponent copy"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Sign-up',
    description:''
}

const Signup = () => {
    return (
        <SignUpComponent/>
    )
}

export default Signup
