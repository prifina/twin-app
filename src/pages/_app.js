import '@/styles/globals.css'
import '@/styles/new-styles.css'
import '@/styles/markdown-styles.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  //console.log("PAGE PROPS ", pageProps);
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <title>{pageProps.title}</title>
      <meta
        name="description"
        content={pageProps.caption}
      />
      <meta property="og:site_name" content={pageProps.title} />
      <meta property="og:title" content={pageProps.title} />
      <meta
        property="og:description"
        content={pageProps.caption}
      ></meta>
      {pageProps['avatar-url'] !== undefined && <>
        <meta property="og:image" content={pageProps['avatar-url']} />
        <meta property="og:image:secure_url" content={pageProps['avatar-url']} />
        <meta property="og:image:type" content={pageProps.mimeType} />
      </>}
    </Head>

    <Component {...pageProps} />

  </>
}