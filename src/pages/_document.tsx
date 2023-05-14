import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en" className="dark">
        <Head />
        <body className="relative min-h-full min-w-[375px] max-w-full bg-gradient-to-b from-black via-slate-900 to-black font-primary text-zinc-50 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
