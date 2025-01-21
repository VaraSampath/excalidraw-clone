"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { Mail, ArrowRight, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

const AuthPage = ({ type }: { type: "signin" | "signup" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in attempt with:", { email, password });
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
