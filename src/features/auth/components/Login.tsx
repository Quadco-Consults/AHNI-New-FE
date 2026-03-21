"use client";

import LoginForm from "./forms/LoginForm";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    return (
        <div className="flex flex-1 h-screen relative">
            {/* Home Button - Top Left Corner */}
            <div className="absolute top-6 left-6 z-50">
                <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary border-gray-300 hover:border-primary px-6 py-2"
                >
                    <Home className="h-5 w-5" />
                    Home
                </Button>
            </div>

            <div className="flex bg-[#FEF2F2] w-full">
                <div className="w-full flex flex-1 items-center justify-center">
                    <LoginForm />
                </div>
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-center bg-[url('/img/login.jpeg')] bg-[#161630B2] bg-blend-overlay bg-opacity-100">
                    <div className="font-bold text-xl text-white text-center">
                        Providing solutions that are essential to the <br />
                        advancement of human development in communities we{" "}
                        <br /> serve
                    </div>
                </div>
            </div>
        </div>
    );
}
