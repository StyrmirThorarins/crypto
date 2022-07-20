import { getPytorchGraph } from '../lib/api/crypto'

const CryptoGraphFlask = (props: any) => {

    const cryptoList = props.cryptoSelected

    let graphHtml = 'GRAPH'

    // get pytorch graph data for selected crypto
    getPytorchGraph(cryptoList).then(data => {
        console.log('CryptoGraphFlask getPytorchGraph: ', data)
        // graphHtml = data
    }).catch(err => {
        console.log('CryptoGraphFlask getPytorchGraph: ', err)
    })

    return (
        <div
            dangerouslySetInnerHTML={{ __html: graphHtml }}
        />
    )
}
export default CryptoGraphFlask