import React, { useState } from "react";
import { sumBy } from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const dataSet = {
    chart: {
        type: "column",
        spacing: [24, 24, 24, 24],
    },
    title: {
        text: 'Number of Cases per category'
    },
    colors: ['#cce5ff', '#f8d7da', '#d4edda'],
    plotOptions: {
        series: {
            stacking: "normal",
            colorByPoint: true,
            
        },
    },
    yAxis: { title: { text: 'Number of Cases' } },
    xAxis: {
        title: { text: 'Category' },
        categories: [
            'Confirmed',
            'Deaths',
            'Recovered'
        ]
    },
    series: [
    ]
};

const Graph = ({ countries }) => {
    const [dataS, setData] = useState(dataSet)
    React.useEffect(() => {
        const Confirmed = sumBy(countries, 'confirmed')
        const Deaths = sumBy(countries, 'deaths')
        const Recovered = sumBy(countries, 'recovered')
        dataSet.series = [{
            name: 'Covid cases',
            data: [Confirmed, Deaths, Recovered],
        }]
        setData({ ...dataSet })
        return () => { }
    }, [countries])
    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={dataS} />
        </div>
    );
};

export default Graph
