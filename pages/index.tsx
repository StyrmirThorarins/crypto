import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CryptoGraph from '../components/CryptoGraph'
import CryptoList from '../components/CryptoList'
import CryptoSelected from '../components/CryptoSelected'
import { useState, useEffect } from 'react'
import { getCompleteCryptoList, getCryptoAcronymList, getCryptoData, getPytorchGraph } from '../lib/api/crypto'
import styles from '../styles/Home.module.css'
import React from 'react'

const Home: NextPage = () => {

  const [selectedCrypto, setSelectedCrypto] = useState<string[]>([])
  const [availableCrypto, setAvailableCrypto] = useState<string[]>(['Loading...'])
  const [visibleCrypto, setVisibleCrypto] = useState<string[]>(['Loading...'])

  // fetch async data during initial load
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompleteCryptoList().then(data => {
      console.log('loading cryptoList: ', data)
      setAvailableCrypto(data)
      setVisibleCrypto(data)
    }).catch(err => {
      console.log('getCompleteCryptoList: ', err)
    })
  }, [loading])

  // add crypto to selected list, remove from available list
  const addCrypto = (acronym: string) => {
    console.log('addCrypto: ', acronym)
    setSelectedCrypto([...selectedCrypto, acronym])
    setAvailableCrypto(availableCrypto.filter(crypto => crypto !== acronym))
  }

  // remove crypto from selected list, add to available list
  const removeCrypto = (acronym: string) => {
    setAvailableCrypto([...availableCrypto, acronym])
    setSelectedCrypto(selectedCrypto.filter(item => item !== acronym))
  }

  // get pytorch graph data for selected crypto
  const getGraph = () => {

    for (let crypto in selectedCrypto) {
      getCryptoData(crypto)
        .then(data => {
          console.log('addCrypto data returned: ', data)
        })
        .catch(error => {
          console.log('addCrypto error: ', error)
        })
    }

    getPytorchGraph('BTC').then(data => {
      return data
    })
  }

  // @param: input element
  // searches through availableCrypto for matches to input element value, updates visibleCrypto with results
  const updateVisibleCrypto = (element: any) => {
    const text = element.nativeEvent.target.value

    // if input is empty, show all available crypto
    if (text === '') {
      setVisibleCrypto(availableCrypto)
      return
    }

    // filter available crypto list for matches to input text and create new array to hold matches
    let newVisibleCrypto: string[] = []
    availableCrypto.forEach(item => {
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

  // const graphHtml = getGraph()
  // console.log('graphHtml: ', graphHtml)

  const graph = '<p>graph</p>'

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
              <div className='border border-white rounded-md p-4 my-4'>
                <label className='text-white text-lg'>Selected Crypto</label>
                <CryptoSelected selectedCrypto={selectedCrypto} removeCrypto={removeCrypto} />
              </div>
              <div>
                <p className='text-white text-lg'>Enter Crypto Acronym to Filter Crypto List</p>
                <input type="text" onChange={(e) => updateVisibleCrypto(e)} className='w-64 p-2 my-4 bg-gray-100 border-2 border-gray-200 rounded-lg' placeholder="Search" />
              </div>
              <div className='border border-white rounded-md p-4 my-4'>
                <label className='text-white text-lg'>Crypto List</label>
                <CryptoList availableCrypto={visibleCrypto} addCrypto={addCrypto} />
              </div>
            </div>
          </div>

          <div className='flex-1 p-4' style={{ width: 800 }} >
            {/* <CryptoGraph cryptoSelected={CryptoSelected} /> */}
          </div>
        </div>

        <div>
          <div
            dangerouslySetInnerHTML={{ __html: graph }}
          />

        </div>

      </main>

    </div>
  )
}

export default Home
