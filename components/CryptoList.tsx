const CryptoList = () => {

    const cryptoListFile = '../data/crypto-currencies.json'

    const getCryptoList = () => {
        /*
        const json = fetch(cryptoListFile)
            .then(response => response.json())
            .then(data => data)
            */

        const aCrypto = []
        const json = JSON.parse(cryptoListFile)
        for (let crypto in json) {
            console.log(crypto)
            aCrypto.push(crypto)
        }
    }


const cryptoList = getCryptoList()

return (
    <>
        {/* cryptoList.map((crypto: any) => {} */}
        {cryptoList}
        [CryptoList]
    </>
)
}
export default CryptoList