import { QRCodeSVG } from "qrcode.react"
import { cn } from "~/src/utils"

export type QRCodeProps = {
  id: string
  value: string
  size: number
  widthLogo?: number
  heightLogo?: number
  className?: string
}

export const SvgQRCode = ({
  id,
  value,
  size,
  widthLogo = 32,
  heightLogo = 32,
  className,
}: QRCodeProps): JSX.Element => {
  return (
    <QRCodeSVG
      className={cn("mx-auto mt-4", className)}
      id={id}
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
        height: widthLogo,
        width: heightLogo,
        excavate: true,
      }}
    />
  )
}
