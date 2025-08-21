import { Skeleton } from "@/components/ui/skeleton";

export default function LoginSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <Skeleton className="h-7 w-48 mb-3" />  
            <Skeleton className="h-4 w-64 mb-8" />  
            <Skeleton className="h-11 w-full max-w-sm mb-4" /> 
            <Skeleton className="h-3 w-72" />
        </div>
    );
}