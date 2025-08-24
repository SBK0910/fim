"use client"

import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderForm from "./orderForm";

interface OrderDialogProps {
    ticker: string
    series: string
    side: "buy" | "sell"
}

export default function OrderDialog({ ticker, series, side }: OrderDialogProps) {
    const {isSignedIn} = useAuth();
    const [open, setOpen] = useState(false);

    const router = useRouter();

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
                            router.push(`/auth?redirect_url=${encodeURIComponent(`/instrument/${ticker}/${series}`)}`)
                        }
                    }}
                >
                    {side === "buy" ? "Buy" : "Sell"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-full">
                {isSignedIn && <OrderForm ticker={ticker} series={series} side={side} setOpen={setOpen} />}
            </DialogContent>
        </Dialog>
    )
}