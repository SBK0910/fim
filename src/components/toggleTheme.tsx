"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function ToggleTheme() {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle Theme"
			className="hover:text-primary transition-colors cursor-pointer"
		>
			<div className="flex w-6 h-6 items-center justify-center relative">
				<Sun className="absolute dark:hidden" />
				<Moon className="absolute hidden dark:block" />
			</div>
		</Button>
	)
}