"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast, useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const sendMessageSchema = z.object({
  content: z.string().min(10, "Message must be at least 10 characters long"),
});

// streming related ..........
import { readStreamableValue } from 'ai/rsc';
// import { generateMsg } from "@/app/(app)/suggest-messages/suggestMessages";
import { generateMsg } from "@/app/(app)/suggest-messages/suggestMessages";




const Page = () => {
  const param = useParams<{ userName: string }>();
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const userName = param.userName;
  const { toast } = useToast();
  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
  });


  
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const [generation, setGeneration] = useState<string>(initialMessageString);

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    setSendingMessage(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/send-message",
        {
          content: data.content,
          userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "message send successfully",
      });
      form.setValue("content"," ");
    } catch (error) {
      const axiosErrors = error as AxiosError<ApiResponse>;
      toast({
        title: "error sending message",
        description: axiosErrors.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const suggestMessage = async () => {
    setGeneration(" ");
    const {output} =await generateMsg();
    for await (const delta of readStreamableValue(output)) {
      setGeneration(currentGeneration => `${currentGeneration}${delta}`);
    }
  };

  const setMessage=(msg:string)=>{
    form.setValue("content",msg);
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Message</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your message" {...field} className="w-100%"/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
         
          <div className="flex justify-center">
            {sendingMessage ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait..
              </Button>
            ) : (
              <Button type="submit" >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      </div>
      <div>
      <Button onClick={suggestMessage} className="my-4">Suggest Messages</Button>
      </div>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Messages</h3>
          
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            
            {
              generation.split('||').map((msg,index)=>(
                <Button key={index} onClick={()=>setMessage(msg)} variant="outline">{msg}</Button>
              ))
            }
            
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
