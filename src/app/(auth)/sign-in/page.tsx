"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
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
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // zod implements
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // form submit handler
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    console.log(result);
    if (result?.error) {
      if (result.error === "CredentialsSigninError") {
        toast({
          title: "Login Failed",
          description: "incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-grey-100  overflow-hidden">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold  tracking-tight lg:text-5xl mb-6">
          join Unseen
          </h1>
          <p className="mb-4">Sign In to get started Your Anonymous Message</p>
        </div>

        {/* form */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email or Username"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait..
                </>
              ) : (
                "Sign In"
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
          Sign In With Google
        </Button>

        <div className="text-center mt-4">
          <p>Not A Member ? </p>
          <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
