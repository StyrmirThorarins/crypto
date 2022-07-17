
// fetch local crypto list test data, return as multidimensional array
export const getLocalCryptoListData = () => {
    const cryptoListFile = require('../data/crypto-currencies.json');
    let cryptoList = [];

    for (let item in cryptoListFile)
        cryptoList.push([item, cryptoListFile[item].name])

    return cryptoList;
}

// fetch crypto timeseries data from coingecko API
export const fetchCryptoData = async (acronym: string) => {
    const url = `https://api.coingecko.com/api/v3/coins/${acronym}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const getCryptoAcronymList = () => {
    const data = getLocalCryptoListData()
    let acronymList = []

    for (let item in data) {
        acronymList.push(data[item][0])
    }

    return acronymList
}

// returns multidimensioan array of crypto data
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