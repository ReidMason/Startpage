import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head id="testing" />
      <meta name="description" content="Startpage" />
      <body id="Here" className="bg-primary-50/90 dark:bg-primary-900/90">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
