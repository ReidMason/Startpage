import Document, { Html, Head, Main, NextScript } from "next/document";
import { getGlobalClasses } from "../../utils";

export default class MyDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;

    return (
      <Html lang="en">
        <Head />
        <meta name="description" content="Startpage" />
        <body
          className={`bg-primary-50/90 dark:bg-primary-900/90 ${getGlobalClasses(
            pageProps.config
          )}`}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
