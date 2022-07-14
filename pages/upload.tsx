import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import DropzoneButton from '../components/upload.tsx'

const Upload: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Upload Paper</title>
        <meta name="description" content="Upload Paper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Upload Paper</h1>

        <p className={styles.description}>
          <DropzoneButton/>
        </p>
      </main>
    </div>
  )
}

export default Upload
