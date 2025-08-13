import SignInComponent from "@/components/Auth/SignInComponent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Sign-in',
  description: "Sign in to the Ghost Message"
}

const Signin = () => {

  return (
    <SignInComponent />
  )
}

export default Signin
