import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="container relative min-h-screen min-w-fit max-w-full bg-gradient-to-b from-black to-slate-900 font-primary text-zinc-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
