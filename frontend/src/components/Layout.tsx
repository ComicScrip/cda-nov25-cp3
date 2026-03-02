import Head from "next/head";
import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{`Dev Blog - ${pageTitle}`}</title>
        <meta name="description" content="Web development blog with articles and tutorials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-gray-100" data-theme="dark">
        <Header />
        <main className="pb-[200px] bg-gray-900 min-h-screen">{children}</main>
      </div>
    </>
  );
}
