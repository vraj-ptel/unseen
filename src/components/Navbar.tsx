"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session, status } = useSession();
  //   const { data:session, status } = useSes  sion();
  const user: User = session?.user as User;
  const { setTheme ,theme} = useTheme()
  
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-row md-flex-row justify-between items-center">
        <Link className="text-xl font-bold mb-4 md:mb-0" href={"#"}>
          Unseen 
        </Link>
        {session ? (
          <>
            <span className="mr-4">Welcome,{user.userName ?? user.email}</span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button className="w-full md:w-auto">
            {" "}
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
