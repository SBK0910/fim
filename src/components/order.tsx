"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema } from "@/schemas/schema";
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

type BuyProps = {
    ticker: string;
    series: string;
    side: "buy" | "sell"
};

export function Order({ ticker, series, side }: BuyProps) {
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

    function onSubmit(values: z.infer<typeof orderFormSchema>) {
        console.log("Submitting buy order:", values);
        // Call your API here
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={`font-semibold tracking-tight ${side === "buy"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                        } md:w-24 w-full cursor-poiner`}
                >
                    {side === "buy" ? "Buy" : "Sell"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <h2 className="text-lg font-bold">
                    {side === "buy" ? "Buy Order" : "Sell Order"}
                </h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Quantity */}
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
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Order Type */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="mb-1 font-semibold">Order Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
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

                        {/* Limit price field (only if limit order) */}
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

                        {/* Submit */}
                        <Button type="submit" className="w-full">
                            Place Order
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}