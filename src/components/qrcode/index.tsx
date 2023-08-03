import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"

const VALUE = "https://picturesofpeoplescanningqrcodes.tumblr.com/" as const

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

export { SvgQRCode, CanvasQRCode }
