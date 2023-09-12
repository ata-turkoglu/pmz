<template>
    <div class="chart-container">
        <span class="title">Üretim</span>
        <div id="chart3"></div>
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
                data: ["Bigbag", "Palet", "Torba", "Farklı Bigbag"],
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
                    name: "Miktar ton",
                    position: "left",
                    axisLine: {
                        show: true,
                    },
                    nameTextStyle: {
                        align: "left",
                        fontWeight: "bold",
                    },
                },
            ],
            series: [
                {
                    name: "Bigbag",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#22668D",
                    data: [],
                },
                {
                    name: "Palet",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#FFCC70",
                    data: [],
                },
                {
                    name: "Torba",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#35A29F",
                    data: [],
                },
                {
                    name: "Farklı Bigbag",
                    type: "bar",
                    stack: "Production",
                    emphasis: {
                        focus: "series",
                    },
                    color: "#8C3333",
                    data: [],
                },
            ],
        },
    }),
    methods: {
        setIncomingData() {
            this.chartOption.xAxis.data = this.xAxis;

            this.chartOption.series.find((itm) => itm.name == "Bigbag").data =
                this.chartData.map((itm) => itm.bigbagValue);

            this.chartOption.series.find((itm) => itm.name == "Palet").data =
                this.chartData.map((itm) => itm.palletValue);

            this.chartOption.series.find((itm) => itm.name == "Torba").data =
                this.chartData.map((itm) => itm.ppValue);

            this.chartOption.series.find(
                (itm) => itm.name == "Farklı Bigbag"
            ).data = this.chartData.map((itm) => itm.diffBigbagValue);
        },
        setChart() {
            let chartDom = document.getElementById("chart3");
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
#chart3 {
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
    #chart3 {
        width: 100%;
        height: 300px;
    }
}
</style>
