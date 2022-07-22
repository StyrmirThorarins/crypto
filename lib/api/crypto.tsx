
import axios from 'axios'


// fetch and return all current crypto currency acronyms via API
export const getCompleteCryptoList = async () => {
    // API reference: https://min-api.cryptocompare.com/documentation?key=Blockchain&cat=blockchainListOfCoins
    // const apiKey = process.env.CRYPTO_COMPARE_API_KEY;
    const apiKey = 'd08fc7ed16943517aafe85d7bca55502156567998e93fb513a826176dab893a6'
    const url = `https://min-api.cryptocompare.com/data/blockchain/list`

    const cryptoList: string[] = []

    const res = await axios.get(url, {
        headers: {
            'authorization': `Apikey ${apiKey}`
        }
    })
        .then(response => {
            for (let item in response.data.Data) {
                cryptoList.push(item)
            }
        })
        .catch(error => {
            console.log('getCompleteCryptoList error: ', error)
        })

    return cryptoList;

}


// fetch crypto timeseries data from API
export const getCryptoData = async (acronym: string, currencySymbol: string = 'USD') => {
    // API refercence: https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
    const apiKey = process.env.CRYPTO_COMPARE_API_KEY;
    const queryLengthLimit = 10  // max 2000
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${acronym}&tsym=${currencySymbol}&limit=${queryLengthLimit}&api_key=${apiKey}`;

    await axios.get(url)
        .then(response => {
            return response.data.Data.Data
        })
        .catch(error => {
            console.log('getCryptoData error: ', error)
        })
}


// return html for pyplot graph, created by calling API on a python Flask server that handles the data fetching and html constructing
export const getPlotlyGraph = async (acronyms: string[], currencySymbol: string = 'USD') => {
    //const url = `http://localhost:8050/pyplotlygraph`;
    const url = `http://localhost:8050/`;


    await axios.get(url, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => {
            console.log('axios response: ', response)
            return response.data.Data.Data
        })
        .catch(error => {
            console.log('getPlotlyGraph error: ', error)
        })

    // const response = await fetch(url)
    // const data = await response.json()

    // const graphData = data.Data.map(item => {
    //     return {
    //         x: item.time,
    //         y: item.close
    //     }
    // }
    // )
}


/////////////////////////////////////////////////////// DEPRECATED ///////////////////////////////////////////////////////
// switched from local JSON file test data to live API data


// DEPRECATED
// fetch local crypto list test data, return as multidimensional array
export const getLocalCryptoListData = () => {
    const cryptoListFile = require('../data/crypto-currencies.json');
    let cryptoList = [];

    for (let item in cryptoListFile)
        cryptoList.push([item, cryptoListFile[item].name])

    return cryptoList;
}


// DEPRECATED
// returns an array with the acronym of each crypto currency, filtered from local JSON object file
export const getCryptoAcronymList = () => {
    const data = getLocalCryptoListData()
    let acronymList = []

    for (let item in data) {
        acronymList.push(data[item][0])
    }

    return acronymList
}


// DEPRECATED
// returns multidimensioan array of crypto data from local JSON object file
// @param acronyms[]: array of crypto data acromyns
// aCrypto[0][0] = cryptoName
// aCrypto[0][1] = cryptoNameAcronym
export const getCryptoList = (acronyms: string[]) => {
    let cryptoListData = getLocalCryptoListData()
    let cryptoList = []

    // get crypto currencies filtered by acronym list
    for (let i in cryptoListData) {
        for (let j in acronyms) {
            if (acronyms[j] === cryptoListData[i][0])
                cryptoList.push([cryptoListData[i][0], cryptoListData[i][1]])
        }
    }

    return cryptoList;
}