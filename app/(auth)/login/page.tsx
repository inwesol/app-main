"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "@/components/toast";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { LogoGoogle } from "@/components/google-logo";
import { login, type LoginActionState } from "../actions";
import Carousel from "./Carousel";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlaceholder(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google sign in...");

      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        toast({
          type: "error",
          description: "Failed to sign in with Google",
        });
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        type: "error",
        description: "An error occurred during Google sign in",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-primary-blue-50 to-indigo-100">
      {/* Left side - Carousel (hidden on mobile and tablet) */}
      <div className="hidden lg:flex w-full lg:w-3/5 relative overflow-hidden">
        <div className="size-full p-6 ">
          <Carousel />
        </div>
      </div>

      {/* Right side - Enhanced Login Form */}
      <div className="flex w-full lg:w-2/5 relative items-center justify-center min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-blue-200/40 via-indigo-100/20 to-transparent" />

        <div className="absolute inset-0 overflow-hidden">
          {/* Top Right Illustration */}
          <div className="absolute -top-20 -right-20 size-80 opacity-[0.08]">
            <svg viewBox="0 0 200 200" className="size-full text-blue-600">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor="currentColor"
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>
              <path
                d="M50,10 Q90,30 100,70 Q110,110 70,140 Q30,170 10,130 Q-10,90 30,60 Q70,30 50,10 Z"
                fill="url(#grad1)"
              />
              <circle
                cx="150"
                cy="50"
                r="30"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M120,120 L180,120 L150,180 Z"
                fill="currentColor"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 size-32 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-32 left-10 size-24 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-2xl blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 size-20 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 size-16 bg-gradient-to-br from-indigo-400/12 to-purple-400/12 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "3.5s" }}
        />

        <div className="mx-auto">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-lg border border-white/30 p-4 relative overflow-hidden">
            <div className="text-center mb-4 relative">
              <div className="flex justify-center mb-2">
                <Image
                  src="./images/logo.svg"
                  alt="Inwesol Logo"
                  className="object-contain"
                  width="48"
                  height="56"
                />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-blue-600 to-primary-green-600 bg-clip-text text-transparent mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to continue your journey
              </p>
            </div>

            {showPlaceholder && (
              <div className="space-y-3 animate-pulse px-4 py-7">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24" />
                  <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-80" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24" />
                  <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl" />
                </div>
                <div className="h-12 bg-gradient-to-r from-primary-green-200 to-primary-green-200 rounded-xl" />
                <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl" />
              </div>
            )}

            <div
              className={
                showPlaceholder
                  ? "opacity-0 absolute inset-0"
                  : "opacity-100 transition-opacity duration-500"
              }
            >
              <AuthForm action={handleSubmit} defaultEmail={email}>
                <SubmitButton isSuccessful={isSuccessful}>Sign In</SubmitButton>

                <p className="text-center text-sm text-gray-600">
                  <Link
                    href="/forgot-password"
                    className="font-semibold text-primary-blue-600 hover:text-primary-blue-700 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </p>

                <div className="relative ">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/90 px-4 text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full h-12 bg-white/80 hover:bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  {isGoogleLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <LogoGoogle />
                      Continue with Google
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    {"Don't have an account? "}
                    <Link
                      href="/register"
                      className="font-semibold text-primary-blue-600 hover:text-primary-blue-700 hover:underline transition-colors"
                    >
                      Sign up
                    </Link>
                    {" for free."}
                  </p>
                </div>
              </AuthForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
