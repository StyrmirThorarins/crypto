import { getPlotlyGraph } from '../lib/api/crypto'

const CryptoGraphFlask = (props: any) => {

    const cryptoList = props.selectedCrypto
    const url = `http://127.0.0.1:8050/?cryptos=${cryptoList}`

    // get pytorch graph data for selected crypto, local JSON file used for development test
    // getPlotlyGraph(cryptoList).then(data => {
    //     console.log('CryptoGraphFlask getPlotlyGraph: ', data)
    //     // graphHtml = data
    // }).catch(err => {
    //     console.log('CryptoGraphFlask getPlotlyGraph: ', err)
    // })

    return (
        <>
            <label className='text-white'>Graph generated and returned by python Flask server. Python handles all API, data handling and Plotly plot graph rendering.</label>
            <br/><br/>
            {cryptoList.length > 0
                ? <iframe src={url} className='w-full h-full' style={{height: 600}}></iframe>
                : <p className='text-white my-4'>No crypto currency selected.</p>
            }

        </>

    )
}
export default CryptoGraphFlask