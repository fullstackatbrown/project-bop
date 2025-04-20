import ReactECharts from "echarts-for-react";
import "./Poll.css";

export default function Poll({data, tag}) {
    let option;
    if (data.chart == "bar") {
        option = {
            tooltip: {
                trigger: "item"
            },
            legend: {
                top: "0%",
                left: "center",
                show: false
            },
            xAxis: {
                type: "category",
                data: Object.keys(data.results),
                show: false
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    data: Object.values(data.results),
                    type: "bar",
                    color: "lightblue",
                    showBackground: true,
                    backgroundStyle: {
                        color: "rgba(180, 180, 180, 0.2)"
                    },
                    label: {
                        show: true,
                        position: "insideBottom",
                        align: "left",
                        rotate: 90,
                        color: "#000",
                        fontSize: 11,
                        fontFamily: "Avenir",
                        formatter: params => params.name
                    }
                }
            ]
        }
    } else {
        option = {
            tooltip: {
                trigger: "item"
            },
            legend: {
                top: "0%",
                left: "center",
                show: false
            },
            series: [
                {
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: true,
                    padAngle: 0,
                    itemStyle: {
                        borderRadius: 0
                    },
                    label: {
                        show: true,
                        fontFamily: "Avenir"
                    },
                    labelLine: {
                        show: true
                    },
                    data: Object.entries(data.results).map(([name, value]) => {return {name, value}})
                }
            ]
        }
    }
    

    return (
        <div className="poll">
            <p><b>{data.question}</b></p>
            <p className="poll-caption">BOP POLL {tag.toUpperCase()}</p>
            <ReactECharts option={option} style={{ height: 400 }}></ReactECharts>
        </div>
    );
}