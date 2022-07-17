// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { fa-solid, fa-circle-arrow-right } from '@fortawesome/pro-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { getCryptoList } from '../lib/api/crypto'

const CryptoSelected = (props: any) => {
    const cryptoList = getCryptoList(props.selectedCrypto)

    return (
        <div className='text-white py-2'>
            <ul className="items-list">
                {cryptoList.map((item: any) => (
                    <li key={item[0]}>{item[0]} - {item[1]} <FontAwesomeIcon icon={faCircleXmark} onClick={() => props.removeCrypto(item[0])} /></li>
                ))}
            </ul>
        </div>
    )
}
export default CryptoSelected