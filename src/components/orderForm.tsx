"use client"

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import z from "zod";
import { orderFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface OrderFormProps {
    ticker: string;
    series: string;
    side: "buy" | "sell";
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrderForm({ ticker, series, side, setOpen }: OrderFormProps) {
    const form = useForm<z.infer<typeof orderFormSchema>>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            quantity: 1,
            type: "market",
        },
    });

    const orderType = form.watch("type");

    async function onSubmit(values: z.infer<typeof orderFormSchema>) {
        try {
            const res = await fetch(`/api/orders/${ticker}/${series}/${side}`, {
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
                `Your ${side} order for ${values.quantity} ${ticker} (${series}) was placed.`
            )

            form.reset()
            setOpen(false) // ✅ close dialog here
        } catch (err) {
            console.error("Order error:", err)
            toast.error("Unexpected error, please try again later.")
        }
    }

    return (
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
    )
}