import { QRCodeSVG } from "qrcode.react"

export type QRCodeProps = {
  id: string
  value: string
  size: number
}

export const SvgQRCode = ({ id, value, size }: QRCodeProps): JSX.Element => {
  return (
    <QRCodeSVG
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
        height: 36,
        width: 36,
        excavate: true,
      }}
    />
  )
}
