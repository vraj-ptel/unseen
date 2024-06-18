"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import message from "@/message.json";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const page = () => {
  return (
    <main className="flex flex-col items-center justify-center p-10">
      <section className="">
        <h1 className="text-4xl font-bold">
          Dive into the world of Anonymous Messaging
        </h1>
        <p className="text-center">
          Explore Mystery Message - Where Your Identity Is Hidden
        </p>
      </section>
      <Carousel className="w-full max-w-xs my-5">
        <CarouselContent>
          {message.map((msg,index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>{msg.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-lg font-semibold">{msg.content}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default page;
