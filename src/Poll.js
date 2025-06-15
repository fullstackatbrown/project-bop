import ReactECharts from "echarts-for-react";
import { useEffect, useRef } from "react";
import "./Poll.css";

const barChartColors = [
    "#84a0f6", "#91cc75", "#ee6666", "#fac858", "#73c0de",
    "#6bc2a2", "#fc8452", "#9a60b4", "#ea7ccc"
];

export default function Poll({ data, tag }) {
    let option;
    if (data.chart === "bar") {
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
                data: data.results.map(({ option, value }) => option),
                show: false
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    type: "bar",
                    data: data.results.map(({ option, value }, index) => ({
                        value,
                        name: option,
                        itemStyle: {
                            color: barChartColors[index % barChartColors.length]
                        }
                    })),
                    showBackground: true,
                    backgroundStyle: {
                        color: "rgba(180, 180, 180, 0.2)",
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
        };
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
                        borderRadius: 0,
                    },
                    label: {
                        show: true,
                        fontFamily: "Avenir",
                    },
                    labelLine: {
                        show: true,
                    },
                    data: data.results.map((({ option, value }) => ({ name: option, value })))
                }
            ]
        };
    }

    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.getEchartsInstance().resize();
        }
    }, [data]);

    return (
        <div style={{ width: "100%" }}>
            <p>
                <b>{data.question}</b>
            </p>
            {tag && <p className="poll-caption">BOP POLL {tag.toUpperCase()}</p>}
            <ReactECharts
                ref={chartRef}
                option={option}
                style={{ height: 400 }}
            ></ReactECharts>
        </div>
    );
}
