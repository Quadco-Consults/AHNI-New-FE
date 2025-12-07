"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form";
import { Alert, AlertDescription } from "components/ui/alert";
import { Eye, EyeOff, Building2, Mail, Lock } from "lucide-react";
import { useVendorLogin, VendorAuthUtils } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "components/Loading";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function VendorLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (VendorAuthUtils.isVendorAuthenticated()) {
      router.push('/vendor-portal/dashboard');
    }
  }, [router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useVendorLogin();

  const onSubmit = (data: LoginFormData) => {
    setLoginError(null);

    login(data, {
      onSuccess: () => {
        router.push('/vendor-portal/dashboard');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message ||
                           error?.response?.data?.error ||
                           error?.message ||
                           "Login failed. Please check your credentials.";
        setLoginError(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex bg-[#FEF2F2] w-full">
        <div className="w-full flex flex-1 flex-col py-8 px-4 lg:px-8">
          {/* Header with AHNI Logo and Title */}
          <div className="text-center mb-8">
            <Image
              src="/imgs/logo.png"
              alt="AHNI Logo"
              width={130}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AHNI</h1>
            <h2 className="text-xl font-semibold text-gray-700">Vendor Portal</h2>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Card className="w-full flex flex-col items-center gap-y-8 py-8 px-6">
                    <div>
                      <h3 className="text-xl font-bold text-center">Sign in to your account</h3>
                      <p className="text-center text-[#667185] mt-1">
                        Enter your credentials to access the vendor portal
                      </p>
                    </div>

                  {loginError && (
                    <Alert variant="destructive" className="mb-4 w-full">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-6 w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email address"
                                className="pl-10 border-primary"
                                disabled={isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10 border-primary"
                                disabled={isPending}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Demo Credentials */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Access</h4>
                      <p className="text-xs text-blue-800 mb-2">Use these test credentials:</p>
                      <div className="text-xs text-blue-800 space-y-1">
                        <div><strong>Email:</strong> test@vendor.com</div>
                        <div><strong>Password:</strong> test123</div>
                      </div>
                    </div>

                    {/* Help Links */}
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                          href="/eoi"
                          className="font-medium text-primary hover:text-primary/80"
                        >
                          Register through EOI
                        </a>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Need help?{" "}
                        <a
                          href="mailto:procurement@ahni.org"
                          className="font-medium text-primary hover:text-primary/80"
                        >
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      size="lg"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Signing in...</span>
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Card>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center bg-[url('/img/login.jpeg')] bg-[#161630B2] bg-blend-overlay bg-cover bg-center">
          <div className="font-bold text-xl text-white text-center px-8">
            Providing solutions that are essential to the <br />
            advancement of human development in communities we{" "}
            <br /> serve
          </div>
        </div>
      </div>
    </div>
  );
}