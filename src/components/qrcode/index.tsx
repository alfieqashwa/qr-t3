import type { Status } from "@prisma/client"
import { QrCode } from "lucide-react"
import Link from "next/link"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { SvgQRCode } from "./svg-qrcode"

type GenerateQRCodeProps = {
  id: string
  name: string
  ticketStatus: Status
}

export const GenerateQRCode = ({
  id,
  name,
  ticketStatus,
}: GenerateQRCodeProps): JSX.Element => {
  /**
   * ? source: https://github.com/zpao/qrcode.react/issues/140
   */
  const onSVGButtonClick = () => {
    const node = document.getElementById("QRCode")
    if (node == null) return

    const svgData = new XMLSerializer().serializeToString(node)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = name
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <Dialog>
      <DialogTrigger className="flex justify-center px-6">
        {ticketStatus === "SOLD" && <QrCode size={28} />}
      </DialogTrigger>

      <DialogContent className="min-w-full pl-32">
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription asChild>
            <>
              <p>
                Click
                <span className="px-1.5 font-medium text-amber-300">
                  Download
                </span>
                button to download QR Code.
              </p>
              <div className="w-full">
                <SvgQRCode
                  id="QRCode"
                  // value={`${
                  //   clientEnv.NEXT_PUBLIC_BASEURL as string
                  // }/visitor/${id}`}
                  value={`/visitor/${id}`}
                  size={512}
                />
              </div>
            </>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-end space-x-2">
          <Button type="button" size="sm" onClick={onSVGButtonClick}>
            Download
          </Button>
          <Link href={`/visitor/${id}`} passHref>
            <Button variant="ghost">Details</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
