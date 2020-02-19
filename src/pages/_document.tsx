import Document, { Html, Head, Main, NextScript } from 'next/document'
import { globalStyles } from '../index.styles';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico?v=1" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          {process.env.GA_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}></script>
              <script>{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', process.env.GA_ID);
              `}</script>
            </>
          )}
          <style dangerouslySetInnerHTML={{__html: globalStyles}} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
