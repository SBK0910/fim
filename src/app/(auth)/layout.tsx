import Header from "@/components/header"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="max-h-screen overflow-clip flex flex-col items-center justify-center p-4">
			<Header isAuthPage isLoggedIn={false} />
			<main className="w-full max-w-md">{children}</main>
		</div>
	)
}