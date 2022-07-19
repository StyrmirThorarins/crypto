// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { fa-solid, fa-circle-arrow-right } from '@fortawesome/pro-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { getCryptoList } from '../lib/api/crypto'

const CryptoList = (props: any) => {

    return (
        <div className='text-white py-2'>
            <ul className="items-list">
                {props.availableCrypto.map((item: any) => (
                    <li key={item}>{item} <FontAwesomeIcon icon={faArrowCircleRight} onClick={() => props.addCrypto(item)} /></li>
                ))}
            </ul>
        </div>
    )
}
export default CryptoList