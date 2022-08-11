// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <link rel="stylesheet" href="..." /> */}
        <link href="/app.css" rel="stylesheet" crossOrigin="anonymous" />
        <link href="/nprogress.css" rel="stylesheet" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
            crossOrigin="anonymous"
        />

        <link
            href="/css/font-awesome.min.css"
            rel="stylesheet"
            crossOrigin="anonymous"
        />
        <link
            href="/css/grid-layout.css"
            rel="stylesheet"
            crossOrigin="anonymous"
        />
        <link href="/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous" />
        <link
            href="/css/react-datepicker.css"
            rel="stylesheet"
            crossOrigin="anonymous"
        />
        <link href="/css/FileUpload.css" rel="stylesheet" crossOrigin="anonymous" />
        <link href="/css/treetable.css" rel="stylesheet" crossOrigin="anonymous" />
        <link href="/css/codemirror.css" rel="stylesheet" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}