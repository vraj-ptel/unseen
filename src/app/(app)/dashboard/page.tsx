"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
 

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // deleting a message only from the UI and not from the server
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  // taking user from session
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  // fetching isAcceptMessages from the database and setting them to the state
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosErrors = error as AxiosError<ApiResponse>;
      toast({
        title: "error",
        description:
          axiosErrors.response?.data.message ??
          "failed to fetch messages setting",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // fetching all messages from the database

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "refreshed Messages",
            description: "messages refreshed successfully",
          });
        }
      } catch (error) {
        const axiosErrors = error as AxiosError<ApiResponse>;
        toast({
          title: "error",
          description:
            axiosErrors.response?.data.message ?? "failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // handle switch changesss
  const handleSwitchChange = async () => {
    // alert("handleSwitchChange")
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "destructive",
      });
    } catch (error) {
      const axiosErrors = error as AxiosError<ApiResponse>;
      toast({
        title: "error",
        description:
          axiosErrors.response?.data.message ||
          "failed to fetch message setting",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessage]);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${session?.user.userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  if (!session || !session.user) {
    return <div className="text">Please login to access the dashboard</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
      <h1 className={`text-4xl font-bold mb-4 `}>User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>

          </>
        ) : (
          <>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={ index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
