<template>
  <div class="container">
    <SmoothLinedChart />
  </div>
</template>

<script>
import SmoothLinedChart from "./charts/SmoothedLineChart.vue";
export default {
  components: { SmoothLinedChart },
  data: () => ({}),
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 10px;
}
</style>
