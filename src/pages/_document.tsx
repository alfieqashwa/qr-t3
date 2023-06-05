import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <Main />
        <body className="min-h-screen bg-background font-sans antialiased">
          <NextScript />
        </body>
      </Html>
    );
  }
}
