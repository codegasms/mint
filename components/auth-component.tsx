"use client";
import { RegisterInput } from "@/lib/validations";
import { registerSchema } from "@/lib/validations";
import { LoginInput } from "@/lib/validations";
import { loginSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchApi } from "@/lib/client/fetch";

export function AuthComponent({
  initialMode = "login",
}: {
  initialMode?: "login" | "register";
}) {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(initialMode === "login");

  const router = useRouter();

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(values: LoginInput) {
    try {
      await fetchApi("auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const mydata = await fetchApi("/me"); // Fetch user data after successful login
      if(mydata.orgs.length === 0){
        router.push("/onboarding");
      }else{
        router.push(`/${mydata.orgs[0].nameId}`);
      }
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error in login",
        description: `${error}`,
        variant: "destructive",
      });
    }
  }

  async function onRegisterSubmit(values: RegisterInput) {
    try {
      await fetchApi("auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      router.push("/onboarding"); // Redirect to home page after successful registration
    } catch (error) {
      console.error(error);
      toast({
        title: "Error in registering",
        description: `${error}`,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold">
          {isLogin ? "Login" : "Register"}
        </CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to login" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLogin ? (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4">
        <Button
          variant="link"
          className="w-full"
          onClick={() => {
            const newMode = isLogin ? "register" : "login";
            setIsLogin(!isLogin);
            router.push(`/auth?mode=${newMode}`, { scroll: false });
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
