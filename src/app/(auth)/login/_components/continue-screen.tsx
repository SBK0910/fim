"use client"

import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from '@clerk/types'
import { toast } from "sonner"
import LoginSkeleton from "./login-skeleton"
import { Button } from "@/components/ui/button"
import Image from "next/image"


interface ContinueScreen {
    redirect_url?: string
}

export default function ContinueScreen({ redirect_url }: ContinueScreen) {
    const { signIn, isLoaded } = useSignIn()

    const signInWith = async (strategy: OAuthStrategy) => {
        try {
            await signIn?.authenticateWithRedirect({
                strategy,
                redirectUrl: '/sso-callback',
                redirectUrlComplete: redirect_url || "/",
            })
        } catch (err) {
            console.error("Sign in error:", err);
            toast.error("Something went wrong. Please try again.");        
        }
    }

    if (!isLoaded) {
        return <LoginSkeleton />
    }

    return <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <h1 className="mb-2 text-2xl font-semibold">Welcome 👋</h1>
        <p className="mb-8 text-sm text-muted-foreground">
            Sign in below (we’ll make your experience way better 😉)
        </p>

        <Button
            variant="outline"
            className="flex items-center gap-3 w-full max-w-sm cursor-pointer"
            onClick={() => signInWith('oauth_google')}
        >
            <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={20}
                height={20}
            />
            Continue with Google
        </Button>

        <p className="mt-6 text-xs text-center text-muted-foreground max-w-md">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">Terms of Service</a> and{" "}
            <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
        </p>
    </div>

}