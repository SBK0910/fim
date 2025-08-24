import Header from "@/components/header";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header isLoggedIn={false} isAuthPage={true} />
            <main className="flex-grow flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}