import { QRCodeCanvas } from "qrcode.react"
import { type QRCodeProps } from "./svg-qrcode"

// TODO: not use (yet)
export const CanvasQRCode = ({ value, size }: QRCodeProps): JSX.Element => {
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
