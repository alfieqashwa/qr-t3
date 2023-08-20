import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { QrReader } from "react-qr-reader"
import { Button } from "../ui/button"

// import dynamic from "next/dynamic"
// const QrReader = dynamic(() => import("react-qr-reader"), {
//   ssr: false,
// })

export default function Scanner() {
  const [selected, setSelected] = useState<string>("environment")
  const [startScan, setStartScan] = useState(false)
  const [loadingScan, setLoadingScan] = useState(false)
  const [data, setData] = useState("No result")

  console.log(`DATA::: `, data)
  return (
    <div className="thom relative flex flex-col justify-center">
      <Button className="mx-16" onClick={() => setStartScan(!startScan)}>
        {startScan ? <span className="whitespace-nowrap">Stop Scan</span> : <span className="whitespace-nowrap">Start Scan</span>}
      </Button>
      <div className="absolute z-20 top-2 right-4">
        {loadingScan && <Loader2 className="animate-spin text-slate-600" />}
      </div>
      {startScan && (
        <div className="flex flex-col">
          <select
            className="mx-auto mt-4"
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value={"environment"}>Back Camera</option>
            <option value={"user"}>Front Camera</option>
          </select>
          <QrReader
            onResult={(result, err) => {
              setLoadingScan(true)
              if (result) {
                // TODO: ts-checking
                // @ts-ignore
                setData(result?.text)
                setStartScan(false)
                setLoadingScan(false)
              }

              if (err) {
                console.info(err)
              }
            }}
            constraints={{
              facingMode: selected,
            }}
            // @ts-ignore
            delay={500}
          />
          <div className="my-4 space-y-2 text-center">
            {data && <p>{data}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
