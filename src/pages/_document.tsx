// import Document, { Html, Head, Main, NextScript } from "next/document";
import { DocumentProps, Html, Main, NextScript, Head } from "next/document";
import { getDocumentClasses, getBodyClasses } from "../../utils";

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  const pageProps = __NEXT_DATA__.props.pageProps;

  return (
    <Html lang="en" className={getDocumentClasses(pageProps.config)}>
      <Head />
      <meta name="description" content="Startpage" />
      <body
        className={`bg-primary-50/90 dark:bg-primary-900/90 ${getBodyClasses(
          pageProps.config
        )}`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
