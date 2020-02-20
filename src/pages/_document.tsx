import Document, { Html, Head, Main, NextScript } from 'next/document'
import { globalStyles } from '../index.styles';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="https://unpkg.com/papercss@1.6.1/dist/paper.min.css" />
          <style dangerouslySetInnerHTML={{__html: globalStyles}} />
          {process.env.GA_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}></script>
              <script dangerouslySetInnerHTML={{__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${process.env.GA_ID}');
              `}}></script>
            </>
          )}
        </Head>

        <body className="padding">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
