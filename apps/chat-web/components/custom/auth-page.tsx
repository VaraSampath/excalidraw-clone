"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { Mail, ArrowRight, Lock, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signInUser } from "@/actions";
import jwt from "jsonwebtoken";
const AuthPage = ({ type }: { type: "signin" | "signup" }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === "signin") {
        const data = await signInUser({ email, password });
        if (data) {
          const details = await jwt.decode(data);
          localStorage.setItem("user", JSON.stringify(details));
          router.push("/");
        }
      }
      if (type === "signup") {
        const { data } = await axios.post("http://localhost:3005/signup", {
          username,
          email,
          password,
        });
        if (data.id) {
          router.push("/signin");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {type === "signin" ? "Welcome back" : "Welcome"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="username"
                    placeholder="Jhon Doe"
                    className="pl-9"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              <Link
                href={type === "signin" ? "/signup" : "/signin"}
                className="text-primary hover:underline"
              >
                {type === "signin"
                  ? "Don&apos;t have an account? Sign up"
                  : "have an account? Sign in"}{" "}
                here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default AuthPage;
