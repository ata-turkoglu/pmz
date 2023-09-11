<template>
    <div class="mainView">
        <div class="mainView_item" @click="$router.push('/heavy-minerals')">
            <span>Ağır Mineraller Tesisi</span>
        </div>
        <div class="mainView_item" @click="$router.push('/quartz')">
            <span>Kuvars Tesisi</span>
        </div>
    </div>
</template>

<script>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();
        onBeforeMount(() => {
            store.state.appBarSelectedFacility = null;
        });
        return {};
    },
};
</script>

<style lang="scss" scoped>
@mixin flexCenter {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
}
.mainView {
    width: 100%;
    height: 100%;
    padding: 1rem;
    &_item:first-of-type {
        margin-top: 1rem;
    }
    &_item {
        @include flexCenter;
        height: 10%;
        margin-bottom: 2rem;
        border: 1px solid rgb(200, 200, 200);
        width: 100%;
        cursor: pointer;
        background-color: rgb(238, 246, 255);
        span {
            font-size: 1.2rem;
            font-weight: 600;
        }
    }
}
</style>
