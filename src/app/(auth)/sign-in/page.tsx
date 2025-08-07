"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"

const Signin = () => {
  const [email, setUsername] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(email, 500)

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <div>
      <h1>Signin Page</h1>
    </div>
  )
}

export default Signin
