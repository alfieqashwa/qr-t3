import type { Status } from "@prisma/client"
import { QrCode } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { api } from "~/src/utils/api"
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

  const { data: session } = useSession()
  const { data, status } = api.eo.nameBySessionId.useQuery(
    {
      id: session?.user.eventOrganizerId as string,
    },
    {
      enabled: !!session?.user.eventOrganizerId,
      select: (data) => ({
        slug: data?.name.replace(/\s+/g, "-"),
      }),
    },
  )

  const onSVGButtonClick = () => {
    const node = document.getElementById("download-qrcode")
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
        {ticketStatus !== "AVAILABLE" && <QrCode size={28} />}
      </DialogTrigger>

      {status === "success" && (
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="mx-auto">Generate QR Code</DialogTitle>
            <DialogDescription asChild>
              <div className="mx-auto p-4">
                <p>
                  Click
                  <span className="px-1.5 font-medium text-amber-300">
                    Download
                  </span>
                  button to download QR Code.
                </p>
                <SvgQRCode
                  id="QRCode"
                  value={`/${data.slug as string}/visitor/${id}`}
                  size={256}
                />
                {/* //! SvgQRCode for download (based on id): the difference is the size */}
                <SvgQRCode
                  id="download-qrcode"
                  value={`/${data.slug as string}/visitor/${id}`}
                  size={512}
                  widthLogo={36}
                  heightLogo={36}
                  className="hidden"
                />
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row items-center justify-end space-x-2">
            <Button type="button" size="sm" onClick={onSVGButtonClick}>
              Download
            </Button>
            <Link href={`/${data.slug as string}/visitor/${id}`} passHref>
              <Button variant="ghost">Details</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
