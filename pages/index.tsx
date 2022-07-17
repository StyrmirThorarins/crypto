import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CryptoGraph from '../components/CryptoGraph'
import CryptoAvailable from '../components/CryptoAvailable'
import CryptoSelected from '../components/CryptoSelected'
import { useState, useEffect } from 'react'
import { getCryptoAcronymList } from '../lib/api/crypto'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const [selectedCrypto, setSelectedCrypto] = useState<string[]>([])
  const [availableCrypto, setAvailableCrypto] = useState<string[]>(getCryptoAcronymList())

/*
  useEffect(() => {
    // getCryptoList(['BTC', 'ADA'])
    // const cryptoList = getCryptoList(selectedCrypto)
    // setCryptoGraphList(cryptoList)
  }), [selectedCrypto];

  useEffect(() => {
  }), [availableCrypto];

  useEffect(() => {
  }), [cryptoGraphList];
*/


  const addCrypto = (acronym: string) => {
    setSelectedCrypto([...selectedCrypto, acronym])
    setAvailableCrypto(availableCrypto.filter(crypto => crypto !== acronym))
  }

  const removeCrypto = (acronym: string) => {
    setAvailableCrypto([...availableCrypto, acronym])
    setSelectedCrypto(selectedCrypto.filter(item => item !== acronym))
  }

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
            <div>
              <CryptoSelected selectedCrypto={selectedCrypto} removeCrypto={removeCrypto} />
              <CryptoAvailable availableCrypto={availableCrypto} addCrypto={addCrypto} />
            </div>
          </div>

          <div className='flex-1 p-4' style={{ width: 800 }} >
            <CryptoGraph cryptoSelected={CryptoSelected} />
          </div>
        </div>

      </main>

    </div>
  )
}

export default Home
