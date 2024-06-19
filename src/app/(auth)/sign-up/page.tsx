"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";

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
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const Page = () => {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUserName = useDebounceCallback(setUserName, 300);

  const { toast } = useToast();
  const router = useRouter();

  // zod implements
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      // if debounced username is  empty

      if (!userName) {
        setUserNameMessage("");
        return;
      }

      setIsCheckingUserName(true);
      setUserNameMessage("");
      try {
        const response = await axios(
          `/api/check-username-unique?userName=${userName}`
        );
        // console.log("responcsee",response);
        setUserNameMessage(response.data.message);
      } catch (error) {
        const axiosErrors = error as AxiosError<ApiResponse>;
        setUserNameMessage(
          axiosErrors.response?.data.message ?? "error checking username"
        );
      } finally {
        setIsCheckingUserName(false);
      }
    };
    checkUserNameUnique();
  }, [userName]);

  // form submit handler
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    setUserNameMessage(" ");
    try {
      // console.log(data);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      // if response if success
      if (response.data.success) {
        toast({ title: "success", description: response.data.message });
        // redirect user to verify code Page
        router.replace(`/verify/${userName}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("error in sign of user", error);
      const axiosErrors = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosErrors.response?.data.message ?? "error in sign up";
      toast({
        title: "error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-grey-100  overflow-hidden">
      <div className="w-full max-w-md p-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold  tracking-tight lg:text-5xl mb-6">
          join Unseen
          </h1>
          <p className="mb-4">Sign up to get started Your Anonymous Message</p>
        </div>

        {/* form */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="userName"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUserName(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {isCheckingUserName ? (
                      <>
                        <Loader2 size={16} />
                      </>
                    ) : (
                      userNameMessage
                    )}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setUserNameMessage("")}
            >
              {isSubmitting ? (
               <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />please wait..</>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <Button
          variant="default"
          className="mt-4 w-full"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="h-full mr-0.25" />
          Sign Up With Google
        </Button>
        <div className="text-center mt-4">
          <p>Already a member ? </p>
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
