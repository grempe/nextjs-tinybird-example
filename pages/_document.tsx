import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document"

import Script from "next/script"

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en-US">
        <Head />

        <body>
          <Main />
          <NextScript />

          {/* Only load the tracker script in environments where NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY is defined. */}
          {process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY && (
            <Script
              src="https://unpkg.com/@tinybirdco/flock.js"
              data-proxy={process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY}
              strategy="beforeInteractive"
            />
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument
