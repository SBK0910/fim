import ContinueScreen from "./_components/continue-screen"

export default async function Auth({ searchParams }: { searchParams: Promise<{ redirect_url?: string }> }) {
    const { redirect_url } = await searchParams
    return (
        <ContinueScreen redirect_url={redirect_url}/>
    )
}
