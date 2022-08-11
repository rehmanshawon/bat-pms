import { Card } from "antd";
import { lineChartConfig } from "utils/constants";
import { LineChart } from "./LineChart";

export const Chart = ({data}) => {
    console.log('maheeeeddds',data);
    console.log(data.widget_type);
    return (
        <>
           {
            data.widget_type === 'Line' && <LineChart config={lineChartConfig}/>
           } 
        </>
    );
};
