import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <meta name="description" content="Startpage" />
      <body className="dark:bg-primary-900/90 bg-primary-50/90">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
