import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicPageRoute = createRouteMatcher([
    '/login(.*)',
    '/sso-callback',
    '/instrument/(.*)',
    '/'
])

const isPublicApiRoute = createRouteMatcher([
    '/api/market',
])

export default clerkMiddleware(
    async (auth, req) => {
        const isApiRoute = new URL(req.url).pathname.startsWith("/api")
        if (isApiRoute) {
            if (!isPublicApiRoute(req)) {
                const { userId } = await auth()
                if (!userId) {
                    return NextResponse.json({ message: "Unauthorized" }, { status: 401 } )
                }
            }
            return NextResponse.next()  
        }

        if (!isPublicPageRoute(req)){
            const { userId, redirectToSignIn} = await auth()
            if (!userId) {
                return redirectToSignIn()
            }
        }
    }
)

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}