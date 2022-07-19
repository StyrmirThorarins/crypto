import { Line } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


const CryptoGraph = (props: any) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const chartLables = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const chartDataSets = [
        {
            label: 'Dataset 1',
            data: chartLables.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    ]

    const data = {
        chartLables,
        datasets: [
            {
                label: 'Dataset 1',
                data: chartLables.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: chartLables.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    const cryptoList = props.cryptoSelected

    // subtract days from a date, such as 365 for a year
    const subtractDays = (days: number, date: Date = new Date()) => {
        date.setDate(date.getDate() - days)

        return date
    }


    // https://react-chartjs-2.js.org/components/line

    return (
        <Line options={options} data={data} className='bg-white' />
    )
}
export default CryptoGraph