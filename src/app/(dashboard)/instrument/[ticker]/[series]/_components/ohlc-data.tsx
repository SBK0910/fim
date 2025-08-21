import { Card, CardContent } from "@/components/ui/card"

interface OHLCDataProps {
  open?: number
  high?: number
  low?: number
  close?: number
}

export default function OHLCData({ open, high, low, close }: OHLCDataProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Open</p><p className="text-xl font-semibold">₹{open?.toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">High</p><p className="text-xl font-semibold text-green-600">₹{high?.toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Low</p><p className="text-xl font-semibold text-red-600">₹{low?.toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground mb-1">Close</p><p className="text-xl font-semibold">₹{close?.toLocaleString()}</p></CardContent></Card>
    </div>
  )
}