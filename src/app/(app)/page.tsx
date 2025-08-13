import { Metadata } from "next";
import HomeComponent from '@/components/Home/Home'

export const metadata: Metadata = {
  title: "Ghost Message - Send Anonymous & Secure Messages",
  description:
    "GhostMsg lets you send anonymous, secure, and private messages instantly. No sign-up required, end-to-end encrypted, and easy to use.",
}

export default function Home() {
  return (
    <div>
      <HomeComponent />
    </div>
  );
}
