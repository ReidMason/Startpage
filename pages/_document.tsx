import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                </Head>
                <body className="bg-nord-0 h-screen">
                    <Main />
                    <NextScript />
                    {/* Empty script tag as chrome bug fix, see https://stackoverflow.com/a/42969608/943337 */}
                    <script> </script>
                </body>
            </Html>
        )
    }
}