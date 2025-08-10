'use client'
import { Container } from "@/components";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'

export default function Home() {

  return (
    <Container className="flex flex-col items-center">
      <section className="text-center mt-4">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900">Send Messages, Stay Invisible</h1>
        <p className="mt-2 text-base lg:text-lg text-slate-600">
          Send and receive anonymous messages safely. No identity, no pressure — just pure honesty.
        </p>
      </section>

      <section className="mt-10 w-full flex justify-center max-w-64 sm:max-w-96 md:max-w-md">
        <Carousel className="w-full" plugins={[Autoplay({ delay: 3000})]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader className="font-semibold">
                      Message from Ghost
                    </CardHeader>
                    <CardContent className="flex min-h-56 md:min-h-72 items-center justify-center p-6">
                      <span className="text-2xl lg:text-4xl font-semibold">{message.content}</span>
                    </CardContent>
                    <CardFooter className="text-gray-700">
                      {message.recieved}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </Container>
  );
}
