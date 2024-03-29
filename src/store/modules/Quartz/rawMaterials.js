import axios from "@/plugins/axios";
import moment from "moment";
import store from "../../index";

export default {
    namespaced: true,
    state: {
        ballCharges: [],
        buttons: {
            ballMillChargeSaveButtonLoading: false,
        },
        currentYearConsumables: [],
    },
    getters: {
        getTotalConsumableCostByCurrentYear: (state) => {
            return state.currentYearConsumables.reduce(
                (acc, curr) => acc + parseFloat(curr.total_price_vat),
                0
            );
        },
        getLastBigbagData: (state) => {
            return state.currentYearConsumables.find(
                (itm) => itm.material == "BİGBAG"
            );
        },
        getLastPalletData: (state) => {
            return state.currentYearConsumables.find(
                (itm) => itm.material == "TAHTA PALET"
            );
        },
        getLastCraftBagData: (state) => {
            return state.currentYearConsumables.find(
                (itm) => itm.material == "KRAFT TORBA"
            );
        },
        getLastPPBagData: (state) => {
            return state.currentYearConsumables.find(
                (itm) => itm.material == "PP TORBA 25 KG"
            );
        },
    },
    mutations: {
        ADD_BALL_CHARGE_DATA(state, data) {
            if (state.ballCharges.length > 0) {
                let obj = { ...data };
                let foundLast = state.ballCharges
                    .filter((itm) => itm.mill == data.mill)
                    .sort((a, b) => b.id - a.id)[0];
                obj.timer_diff = parseFloat(
                    Math.abs(data.timer - foundLast.timer)
                ).toFixed(1);
                obj.timer_total =
                    Number(foundLast.timer_total) + Number(obj.timer_diff);

                state.ballCharges.unshift(Object.assign({}, obj));
            }
            state.buttons.ballMillChargeSaveButtonLoading = false;
        },
        SET_BALL_CHARGE_DATA(state, data) {
            data.forEach((item) => {
                item.workday = moment(item.workday).format("YYYY-MM-DD");
            });
            state.ballCharges = data;
        },
        SET_CURRENT_YEAR_CONSUMABLES(state, data) {
            state.currentYearConsumables = [...data];
        },
    },
    actions: {
        addBallChargeData({ commit }, data) {
            return axios
                .post("/rawMaterials/ballCharge", data)
                .then((result) => {
                    if (result.status == 200) {
                        data.id = result.data[0].id;
                        commit("ADD_BALL_CHARGE_DATA", data);
                        return true;
                    } else {
                        store.state.commonErrorText = result.statusText;
                        store.state.commonDialogs.errorDialog = true;
                        return false;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        getBallChargeData({ commit }) {
            return axios
                .get("/rawMaterials/getBallCharges")
                .then((result) => {
                    if (result.status == 200) {
                        commit("SET_BALL_CHARGE_DATA", result.data);
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        getLastPurchasedPackagingDate({ commit }, data) {
            return axios
                .post("/rawMaterials/getLastPackaging", data)
                .then((result) => {
                    if (result.status == 200) {
                        return { state: true, data: result.data[0] };
                    } else {
                        return false;
                    }
                });
        },
        addConsumableData({ commit }, data) {
            return axios
                .post("/rawMaterials/addConsumable", data)
                .then((result) => {
                    if (result.status == 200) {
                        store.state.commonDialogs.successDialog = true;
                        return { state: true, data: result.data[0] };
                    } else {
                        store.state.commonErrorText = error;
                        store.state.commonDialogs.errorDialog = true;
                        return false;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        getPurchasedConsumablesByYear({ commit, state }, year) {
            if (state.currentYearConsumables.length <= 0) {
                return axios
                    .get("/rawMaterials/purchasedConsumablesByYear", {
                        params: { year },
                    })
                    .then((result) => {
                        if (result.status == 200) {
                            commit("SET_CURRENT_YEAR_CONSUMABLES", result.data);
                        }
                        console.log("getPurchasedConsumablesByYear", result);
                    });
            }
        },
    },
};
