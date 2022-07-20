import { getPytorchGraph } from '../lib/api/crypto'

const CryptoGraphFlask = (props: any) => {

    const cryptoList = props.cryptoSelected
    const url = `http://127.0.0.1:8050/app`
    // const url = `http://127.0.0.1:8050/app&crypto_list=${JSON.stringify(cryptoList)}`

    // get pytorch graph data for selected crypto
    // getPytorchGraph(cryptoList).then(data => {
    //     console.log('CryptoGraphFlask getPytorchGraph: ', data)
    //     // graphHtml = data
    // }).catch(err => {
    //     console.log('CryptoGraphFlask getPytorchGraph: ', err)
    // })

    return (
        <>
            {/*
            <div
                dangerouslySetInnerHTML={{ __html: graphHtml }}
            />
            */}
            <label className='text-white'>Pyplot API data and graph handled and rendered on python Flask server.</label>
            <iframe src={url} className='' style={{ width: 600, height: 600 }}></iframe>

        </>

    )
}
export default CryptoGraphFlask