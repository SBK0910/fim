import Header from "@/components/header"
import { auth } from "@clerk/nextjs/server"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth()

    return (
        <div className="min-h-screen flex flex-col">
            <Header isLoggedIn={!!userId} isAuthPage={false} />
            <main className="flex-1 pt-16">{children}</main>
        </div>
    )
}