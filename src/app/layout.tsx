import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/context/AuthProvider'
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Ghost Messsage",
        template: "%s | Ghost Message"
    },
    description: "Send anonymous, secure, and private messages instantly. Perfect for feedback, confessions, and open communication.",
    metadataBase: new URL("https://ghost-message-eta.vercel.app"),
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "Ghost Message",
        description: "Send anonymous, secure, and private messages instantly. Perfect for feedback, confessions, and open communication.",
        siteName: "Ghost Message",
        url: "https://ghost-message-eta.vercel.app",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "GhostMsg preview",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ghost Message",
        description: "Send anonymous, secure, and private messages instantly. Perfect for feedback, confessions, and open communication.",
        images: ["/og-image.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-title" content="GhostMsg" />
            </head>
            <AuthProvider>
                <body
                    className={`${geistSans.className} antialiased`}
                >
                    <main>{children}</main>
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
