import Head from "next/head";

type HeaderProps = { titleHeader?: string };

export const Header = ({ titleHeader = "" }: HeaderProps): JSX.Element => (
  <Head>
    <title>{titleHeader}</title>
    <meta name="description" content="QR-T3 App" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);
