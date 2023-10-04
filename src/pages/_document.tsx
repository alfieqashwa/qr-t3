import Document, { Head, Html, Main, NextScript } from "next/document"

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <Main />
        <body className="mx-auto min-h-screen min-w-[350px] max-w-[120rem] bg-background font-sans antialiased">
          <NextScript />
        </body>
      </Html>
    )
  }
}
