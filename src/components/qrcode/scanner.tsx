import { Loader2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { QrReader } from "react-qr-reader"
import { Button } from "~/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"

// import dynamic from "next/dynamic"
// const QrReader = dynamic(() => import("react-qr-reader"), {
//   ssr: false,
// })

export default function Scanner() {
  const [selected, setSelected] = useState<string>("environment")
  const [startScan, setStartScan] = useState(false)
  const [loadingScan, setLoadingScan] = useState(false)
  const [data, setData] = useState("No Result...")

  useEffect(() => {
    if (startScan && data === "No Result...") {
      setLoadingScan(true)
    } else {
      setLoadingScan(false)
    }
  }, [startScan, data])

  const handleScanner = () => {
    setStartScan((prevScan) => (prevScan = !prevScan))
  }

  console.log(`DATA::: `, data)
  return (
    <div className="relative flex flex-col justify-center">
      <Button className="mx-auto" onClick={handleScanner}>
        {startScan ? (
          <span className="whitespace-nowrap">Stop Scan</span>
        ) : (
          <span className="whitespace-nowrap">Start Scan</span>
        )}
      </Button>
      <div className="absolute right-4 top-2 z-20">
        {loadingScan && <Loader2 className="animate-spin text-slate-600" />}
      </div>
      {startScan && (
        <div>
          <QrReader
            onResult={(result, err) => {
              if (!!result) {
                // TODO: ts-checking
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const resultText = result?.text as string // Assign the value to a new variable
                setData(resultText || "")
                setStartScan(false)
                setLoadingScan(false)
              }

              if (!!err) {
                console.info(err)
              }
            }}
            constraints={{
              facingMode: selected,
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delay={500}
          />
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="mx-auto w-[180px]">
              <SelectValue placeholder="Camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="environment">Back Camera</SelectItem>
              <SelectItem value="user">Front Camera</SelectItem>
            </SelectContent>
          </Select>
          <div className="my-4 space-y-2 text-center">
            {data && <p>{data}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
