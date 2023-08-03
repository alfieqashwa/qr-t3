import type { Status } from "@prisma/client"
import { Loader2, QrCode } from "lucide-react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

const VALUE = "https://picturesofpeoplescanningqrcodes.tumblr.com/" as const

type GenerateQRCodeProps = {
  id: string
  ticketStatus: Status
}

export const GenerateQRCode = ({
  id,
  ticketStatus,
}: GenerateQRCodeProps): JSX.Element => {
  const isLoading = false
  return (
    <Dialog>
      <DialogTrigger className="w-md flex justify-center px-6">
        {ticketStatus === "SOLD" && <QrCode size={28} />}
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Generate QR Code</DialogTitle>
          <DialogDescription className="thom flex flex-col items-center space-y-4 py-4">
            <p>
              Click
              <span className="px-1.5 font-medium text-amber-300">
                Download
              </span>
              to download the QR Code.
            </p>
            <SvgQRCode />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center justify-end space-x-2">
          {isLoading ? (
            <Button disabled variant="destructive" size="sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" size="sm">
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type QRCodeProps = {
  value?: string
  size?: number
}

const SvgQRCode = ({ value = VALUE, size = 256 }: QRCodeProps): JSX.Element => {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level="H"
      includeMargin={true}
      imageSettings={{
        src: "https://static.zpao.com/favicon.png",
        x: undefined,
        y: undefined,
        height: 36,
        width: 36,
        excavate: true,
      }}
    />
  )
}

const CanvasQRCode = ({
  value = VALUE,
  size = 256,
}: QRCodeProps): JSX.Element => {
  return (
    <QRCodeCanvas
      value={value}
      size={size}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level="H"
      includeMargin={true}
      imageSettings={{
        src: "https://static.zpao.com/favicon.png",
        x: undefined,
        y: undefined,
        height: 36,
        width: 36,
        excavate: true,
      }}
    />
  )
}
