<template>
    <div class="chart-container">
        <span class="title">Üretim</span>
        <div id="ballConsumptionByProduceChart"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
export default {
    props: ["xAxis", "chartData"],
    data: () => ({
        chartOption: {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {
                z: 1,
                data: ["150 M", "75 M", "63 M", "45 M", "Bilye"],
                type: "scroll",
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                data: [],
                type: "category",
                name: "Gün",
                axisTick: {
                    alignWithLabel: true,
                },
                nameLocation: "center",
                nameTextStyle: {
                    align: "center",
                    verticalAlign: "top",
                    lineHeight: 35,
                    fontWeight: "bold",
                },
            },
            yAxis: [
                {
                    type: "value",
                    name: "Miktar (ton)",
                    position: "left",
                    axisLine: {
                        show: true,
                    },
                    nameTextStyle: {
                        align: "left",
                        fontWeight: "bold",
                    },
                },
                {
                    type: "value",
                    name: "Bilye (kg/t)",
                    position: "right",
                    axisLine: {
                        show: true,
                    },
                    nameTextStyle: {
                        align: "right",
                        fontWeight: "bold",
                    },
                    scale: true,
                    axisLabel: {
                        formatter: "{value} kg/t",
                    },
                },
            ],
            series: [
                {
                    name: "150 M",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#184e77",
                    data: [],
                },
                {
                    name: "75 M",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#168aad",
                    data: [],
                },
                {
                    name: "63 M",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#76c893",
                    data: [],
                },
                {
                    name: "45 M",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#d9ed92",
                    data: [],
                },
                {
                    name: "Bilye",
                    type: "line",
                    stack: "Consumption",
                    color: "red",
                    yAxisIndex: 1,
                    data: [],
                },
            ],
        },
    }),
    methods: {
        setIncomingData() {
            console.log("last", this.chartData);
            this.chartOption.xAxis.data = this.xAxis;

            this.chartOption.series.find((itm) => itm.name == "150 M").data =
                this.chartData.map(
                    (itm) =>
                        itm.produced?.find((itm) => itm.product_name == "150 M")
                            .totalAmount || 0
                );

            this.chartOption.series.find((itm) => itm.name == "75 M").data =
                this.chartData.map(
                    (itm) =>
                        itm.produced?.find((itm) => itm.product_name == "75 M")
                            .totalAmount || 0
                );

            this.chartOption.series.find((itm) => itm.name == "63 M").data =
                this.chartData.map(
                    (itm) =>
                        itm.produced?.find((itm) => itm.product_name == "63 M")
                            .totalAmount || 0
                );

            this.chartOption.series.find((itm) => itm.name == "45 M").data =
                this.chartData.map(
                    (itm) =>
                        itm.produced?.find((itm) => itm.product_name == "45 M")
                            .totalAmount || 0
                );
            this.chartOption.series.find((itm) => itm.name == "Bilye").data =
                this.chartData.map((itm) => itm.consumptionByProduced || 0);
        },
        setChart() {
            let chartDom = document.getElementById(
                "ballConsumptionByProduceChart"
            );
            let myChart = echarts.init(chartDom);

            myChart.showLoading();
            setTimeout(() => {
                myChart.hideLoading();
                myChart.setOption(this.chartOption);
            }, 1000);
            window.onresize = () => {
                myChart.resize();
            };
        },
    },
    created() {
        this.setIncomingData();
    },
    mounted() {
        setTimeout(() => {
            this.setChart();
        }, 300);
    },
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 500px;
    border-radius: 4px;
    padding-top: 20px;
    border: 1px solid rgb(220, 220, 220);
}
.title {
    height: 5%;
    display: flex;
    align-self: flex-start;
    padding-left: 5%;
    font-size: 1.2rem;
    font-weight: 600;
}
#ballConsumptionByProduceChart {
    width: 100%;
    height: 95%;
    padding-inline: 5px;
    padding-top: 20px;
    padding-bottom: 0;
}
@media screen and (max-width: 600px) {
    .chart-container {
        width: 100%;
        height: fit-content;
        box-shadow: unset;
        border-radius: 0;
        border-bottom: 1px solid rgb(220, 220, 220);
    }
    #ballConsumptionByProduceChart {
        width: 100%;
        height: 300px;
    }
}
</style>
