"use client"

import { Settings2, Sun, Moon, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded, isSignedIn, signOut } = useAuth()

  if (pathname === "/auth/sso-callback") return null

  const isAuthPage = pathname === "/auth"

  return (
    <header className="fixed top-0 left-4 right-4 z-50 flex justify-between items-center border-b border-gray-200/20 dark:border-gray-700/20 bg-background/80 backdrop-blur-md p-3">
      {!isAuthPage && (
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button size="sm" variant="ghost" className="cursor-pointer">
              Market
            </Button>
          </Link>
          <Link href="/orders">
            <Button size="sm" variant="ghost" className="cursor-pointer">
              Orders
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-2">
        {!isAuthPage && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-primary transition-colors"
              aria-label={isSignedIn ? "Sign Out" : "Settings"}
              onClick={() => {
                if (!isLoaded) return
                if (isSignedIn) {
                  signOut()
                  toast("Signed out successfully")
                } else {
                  router.push("/auth")
                }
              }}
              disabled={!isLoaded}
            >
              <Settings2 className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
              className="hover:text-primary transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </>
        )}
      </div>

      {isAuthPage && (
        <div className="mr-auto">
          <Link href="/">
            <Button size="icon" variant="ghost" aria-label="Back to Home" className="cursor-pointer">
              <ArrowLeft className="w-5 h-5 hover:text-primary transition-colors" />
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
