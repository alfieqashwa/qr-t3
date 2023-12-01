import React from "react"
import Head from "next/head"

export const HeadMetaData: React.FC<{
  title?: string
  metaDescription?: string
  ogImageUrl?: string
  pathname?: string
}> = ({
  title = "QR-Code Event Organizer Application.",
  metaDescription,
  // ogImageUrl = "https://i.pinimg.com/originals/d7/86/80/d7868094ee2c24230997cff414f37b1d.jpg",
  ogImageUrl = "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  pathname = "",
}) => {
  const defaultTitle = "QR Event Organizer"

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://qrt3.nolpersen.org/"

  const pageUrl = new URL(pathname, baseUrl).toString()

  return (
    <Head>
      <title>{title + " | " + defaultTitle}</title>

      {/* metadata */}
      <meta name="title" content={title + " | " + defaultTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="og:image" itemProp="image" content={ogImageUrl} />
      <meta property="og:url" content={pageUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:image" itemProp="image" content={ogImageUrl} />
      <meta property="og:title" content={title + " | " + defaultTitle} />
      <meta property="og:description" content={metaDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title + " | " + defaultTitle} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta property="twitter:description" content={metaDescription} />
    </Head>
  )
}
