import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ContinueScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            <h1 className="mb-2 text-2xl font-semibold">Welcome 👋</h1>
            <p className="mb-8 text-sm text-muted-foreground">
                Sign in below (we’ll make your experience way better 😉)
            </p>

            <Button
                variant="outline"
                className="flex items-center gap-3 w-full max-w-sm cursor-pointer"
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
                <a href="#" className="underline hover:text-primary">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-primary">
                    Privacy Policy
                </a>.
            </p>
        </div>
    )
}