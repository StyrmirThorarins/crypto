import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CryptoGraph from '../components/CryptoGraph'
import CryptoList from '../components/CryptoList'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const [cryptoFree, setCryptoFree] = useState<string[]>([])
  const [cryptoUsed, setCryptoUsed] = useState<string[]>([])
  const [cryptoGraphList, setCryptoGraphList] = useState<string[]>([])

  useEffect(() => {
    console.log('cryptoFree', cryptoFree)
  }), [cryptoFree];

  useEffect(() => {
    console.log('cryptoUsed', cryptoUsed)
  }), [cryptoUsed];

  useEffect(() => {
    console.log('cryptoGraphList', cryptoGraphList)
  }), [cryptoGraphList];

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Demo</title>
        <meta name="description" content="Crypto Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

      <div className='flex'>

        <div className='object-center flex-1 p-4'>
          <div>
            <p className='text-white text-lg'>Enter Crypto Name or Acronym</p>
            <input type="text" className='w-64 p-2 my-4 bg-gray-100 border-2 border-gray-200 rounded-lg' placeholder="Search" />
          </div>
          <div className='mt-2'>
            <CryptoList />
          </div>
        </div>

        <div className='flex-1 p-4' style={{width: 800}} >
          <CryptoGraph cryptoList={cryptoGraphList} />
        </div>

      </div>

      </main>

    </div>
  )
}

export default Home
