'use client'

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSignIn } from "@clerk/nextjs"
import { OAuthStrategy } from '@clerk/types'
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ContinueScreen() {
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get("redirect_url") || "/"

    const { signIn, isLoaded } = useSignIn()

    const signInWith = async (strategy: OAuthStrategy) => {
        try {
            await signIn?.authenticateWithRedirect({
                strategy,
                redirectUrl: '/auth/sso-callback',
                redirectUrlComplete: redirectUrl,
            })
        } catch (err) {
            console.error("Sign in error:", err)
        }
    }

    // Show skeleton while Clerk loads
    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <Skeleton className="h-7 w-48 mb-3" />   {/* Title */}
                <Skeleton className="h-4 w-64 mb-8" />   {/* Subtitle */}
                <Skeleton className="h-11 w-full max-w-sm mb-4" /> {/* Google Button */}
                <Skeleton className="h-3 w-72" />        {/* Terms of Service */}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
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
    )
}

export default function Auth(){
    <Suspense>
        <ContinueScreen/>
    </Suspense>
}