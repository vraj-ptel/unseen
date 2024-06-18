"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import axios,{AxiosError} from "axios";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { ApiResponse } from "@/types/apiResponse";
import { useState } from "react";
const verifySchema = z.object({
  userName: userNameValidation,
  verifyCode: z.string().length(6, "verify code must be 6 characters long"),
});

const page = () => {
  const router = useRouter();
  const param = useParams<{ userName: string }>();
  const userName = param?.userName;
  const { toast } = useToast();
    const [isSubmitting, setIsSubmitting]=useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      userName,
      verifyCode: "",
    },
  });

  const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
    setIsSubmitting(true);
    try{
         const response = await axios.post<{userName:string,verifyCode:string}>("/api/verify-code", data);
         toast({
            title:`${userName} verified successfully`
         })
         router.replace("/dashboard");
    }
    catch(error){
        const axiosErrors=error as AxiosError<ApiResponse>;
        let errorMessage=axiosErrors.response?.data.message ?? "Something went wrong";
        toast({
            title:"error",
            description:errorMessage,
            variant:"destructive",
            
        })
    }
    finally{setIsSubmitting(false)}
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-grey-100  overflow-hidden">
      <div className="w-full max-w-md p-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold  tracking-tight lg:text-5xl mb-6">
            join Unseen
          </h1>
          <p className="mb-4">
            Enter Your Verify Code to get started Your Anonymous Message
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
               name="userName"
              control={form.control}
             
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} value={userName} readOnly disabled/>
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
               name="verifyCode"
              control={form.control}
             
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VerifyCode</FormLabel>
                  <FormControl>
                  <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
             
            >
              {isSubmitting ? (
               <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />please wait..</>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
