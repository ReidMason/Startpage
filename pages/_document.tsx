import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark bg-primary-50/90">
      <Head />
      <body className="dark:bg-primary-900/90">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
