import { Settings2, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import ToggleTheme from "./toggleTheme"
import { SignOutButton } from "@clerk/nextjs"

export default function Header({ isAuthPage, isLoggedIn }: { isAuthPage: boolean, isLoggedIn: boolean }) {
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
						{isLoggedIn ? (
							<SignOutButton redirectUrl="/login">
								<Button size="icon" variant="ghost" className="cursor-pointer">
									<Settings2 className="w-5 h-5" />
								</Button>
							</SignOutButton>
						) : <Link href="/login">
							<Button size="icon" variant="ghost" className="cursor-pointer">
								<Settings2 className="w-5 h-5" />
							</Button>
						</Link>
						}
						<ToggleTheme />
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
