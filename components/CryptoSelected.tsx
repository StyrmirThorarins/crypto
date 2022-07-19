// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { fa-solid, fa-circle-arrow-right } from '@fortawesome/pro-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { getCryptoList } from '../lib/api/crypto'

const CryptoSelected = (props: any) => {

    return (
        <div className='text-white py-2'>
            <ul className="items-list">
                {props.selectedCrypto.map((item: any) => (
                    <li key={item}>{item} <FontAwesomeIcon icon={faCircleXmark} onClick={() => props.removeCrypto(item)} /></li>
                ))}
            </ul>
        </div>
    )
}
export default CryptoSelected