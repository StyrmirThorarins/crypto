import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CryptoGraphFlask from '../components/CryptoGraphFlask'
import CryptoGraph from '../components/CryptoGraph'
import CryptoList from '../components/CryptoList'
import CryptoSelected from '../components/CryptoSelected'
import { useState, useEffect } from 'react'
import { getCompleteCryptoList, getCryptoAcronymList, getCryptoData, getPlotlyGraph } from '../lib/api/crypto'
import styles from '../styles/Home.module.css'
import React from 'react'
import Link from 'next/link'

const Home: NextPage = () => {

  const [selectedCrypto, setSelectedCrypto] = useState<string[]>([])
  const [completeCryptoList, setcompleteCryptoList] = useState<string[]>(['Loading...'])
  const [visibleCrypto, setVisibleCrypto] = useState<string[]>(['Loading...'])

  // fetch async data during initial load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompleteCryptoList().then(data => {
      setcompleteCryptoList(data)
      setVisibleCrypto(data)
    }).catch(err => {
      console.log('getCompleteCryptoList: ', err)
    })
  }, [loading])

  // add crypto to selected list, remove from visible list
  const addCrypto = (acronym: string) => {
    setSelectedCrypto([...selectedCrypto, acronym])
    setVisibleCrypto(visibleCrypto.filter(crypto => crypto !== acronym))
  }

  // remove crypto from selected list, add to available list
  const removeCrypto = (acronym: string) => {
    setVisibleCrypto([...visibleCrypto, acronym])
    setSelectedCrypto(selectedCrypto.filter(item => item !== acronym))
  }

  // @param: input element
  // searches through completeCryptoList for matches to input element value, updates visibleCrypto with results
  const updateVisibleCrypto = (element: any) => {
    const text = element.nativeEvent.target.value

    // if input is empty, show all available crypto
    if (text === '') {
      setVisibleCrypto(completeCryptoList)
      return
    }

    // filter available crypto list for matches to input text and create new array to hold matches
    let newVisibleCrypto: string[] = []
    completeCryptoList.forEach(item => {
      if (item.includes(text.toUpperCase())) {
        newVisibleCrypto.push(item)
      }
    })

    // remove matches if already selected
    newVisibleCrypto.forEach(item => {
      if (selectedCrypto.includes(item)) {
        newVisibleCrypto = newVisibleCrypto.filter(item => item !== item)
      }
    })

    // update visible crypto list
    setVisibleCrypto([])
    setVisibleCrypto(newVisibleCrypto)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Demo</title>
        <meta name="description" content="Crypto Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <div className='flex flex-row flex-wrap'>

          <div className='w-full md:w-2/6 p-4'>

            <div className='text-slate-300'>
              <p>Project code links on GitHub :</p>
              <div className='ml-4 mt-2'>
                <Link href='https://github.com/StyrmirThorarins/crypto' passHref><a target="_blank">Main Directory</a></Link><br />
                <Link href='https://github.com/StyrmirThorarins/crypto/blob/main/python/app.py' passHref><a target="_blank">Flask Server</a></Link><br />
                <Link href='https://github.com/StyrmirThorarins/crypto/blob/main/python/data%20handling%20workbook.ipynb' passHref><a target="_blank">Python notebook</a></Link>
              </div>
            </div>

            <div className='mt-16'>
              <div className='border border-white rounded-md p-4 my-4'>
                <label className='text-white text-lg'>Selected Crypto</label><br />
                <span className='text-slate-300 text-sm italic'>If a crypto currency does not show up on the graph, then the API service does not have its time series data. Or the number of queries have been maxed out for the month.</span>
                <CryptoSelected selectedCrypto={selectedCrypto} removeCrypto={removeCrypto} />
              </div>
              <div>
                <label className='text-white text-lg py-2 md:p-2'>Enter Crypto Acronym to Filter List</label><br />
                <input type="text" onChange={(e) => updateVisibleCrypto(e)} className='w-64 p-2 my-4 bg-gray-100 border-2 border-gray-200 rounded-lg' placeholder="Search" />
              </div>
              <div className='border border-white rounded-md p-4 my-4'>
                <label className='text-white text-lg'>Crypto List</label>
                <CryptoList visibleCrypto={visibleCrypto} addCrypto={addCrypto} />
              </div>
            </div>
          </div>

          <div className='md:w-3/6 p-4 md:mt-28 md:ml-12 w-full h-full' >
            <CryptoGraphFlask selectedCrypto={selectedCrypto} />
            {/* <CryptoGraph cryptoSelected={CryptoSelected} /> */}
          </div>
        </div>

      </main>

    </div>
  )
}

export default Home
