import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

type PieChartProps = {
    data: { label: string; value: number }[];
    height?: number;
    width?: number;
};

function GraficoCircular(props: PieChartProps) {
    const { data, height = 200, width = 200 } = props;
    return (
        <PieChart
            series={[
                {
                    data,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                },
            ]}
            height={height}
            width={width}
        />
    );
}

export default GraficoCircular;