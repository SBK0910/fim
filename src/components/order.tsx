'use client'

import { useState } from "react"
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema } from "@/lib/schema";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type BuyProps = {
    ticker: string;
    series: string;
    side: "buy" | "sell";
};

export function Order({ ticker, series, side }: BuyProps) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(false);

    const currentFullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    const form = useForm<z.infer<typeof orderFormSchema>>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            quantity: 1,
            type: "market",
            side,
            ticker,
            series,
        },
    });

    const orderType = form.watch("type");

    async function onSubmit(values: z.infer<typeof orderFormSchema>) {
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error.error || "Something went wrong")
                return
            }

            toast.success(
                `Your ${values.side} order for ${values.quantity} ${values.ticker} (${values.series}) was placed.`
            )

            form.reset()
            setOpen(false) // ✅ close dialog here
        } catch (err) {
            console.error("Order error:", err)
            toast.error("Unexpected error, please try again later.")
        }
    }

    if (!isLoaded) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className={`font-semibold tracking-tight ${side === "buy"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                        }  md:w-24 w-full cursor-pointer`}
                    onClick={(e) => {
                        if (!isSignedIn) {
                            e.preventDefault();
                            router.push(`/auth?redirect_url=${encodeURIComponent(currentFullPath)}`)
                        }
                    }}
                >
                    {side === "buy" ? "Buy" : "Sell"}
                </Button>
            </DialogTrigger>
            {isSignedIn && (
                <DialogContent className="max-w-md">
                    <h2 className="text-lg font-bold">
                        {side === "buy" ? "Buy Order" : "Sell Order"}
                    </h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-1 font-semibold">Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter quantity"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-1 font-semibold">Order Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select order type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="market">Market</SelectItem>
                                                <SelectItem value="limit">Limit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {orderType === "limit" && (
                                <FormField
                                    control={form.control}
                                    name="limitPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-1 font-semibold">Limit Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter limit price"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ? Number(e.target.value) : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <Button type="submit" className="w-full">
                                Place Order
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            )}
        </Dialog>
    );
}
