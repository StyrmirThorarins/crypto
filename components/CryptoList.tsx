const cryptoListFile = require('../lib/data/crypto-currencies.json');

// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { fa-solid, fa-circle-arrow-right } from '@fortawesome/pro-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight, faCoffee } from '@fortawesome/free-solid-svg-icons'

const CryptoList = (props: any) => {

    const cryptoNameAcronym = props.name

    const getCryptoList = () => {
        let aCrypto = [];

        let n = 0
        for (let item in cryptoListFile) {
            aCrypto.push([item, cryptoListFile[item].name])
        }

        return aCrypto;
    }

    const cryptoList = getCryptoList()

    const addCryptoToGraph = (cryptoAcronym: string) => {
        console.log('addCrypto', cryptoAcronym)
    }


    return (
        <div className='text-white'>
            <ul className="items-list">
                {cryptoList.map((item) => (
                    <li key={item[0]}>{item[0]} - {item[1]} <FontAwesomeIcon icon={faArrowCircleRight} onClick={() => addCryptoToGraph(item[0])} /></li>
                ))}
            </ul>
        </div>
    )
}
export default CryptoList