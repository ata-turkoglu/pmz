import axios from "axios";
import moment from "moment";
export default {
    namespaced: true,
    state: {
        ballCharges: [],
        buttons: {
            ballMillChargeSaveButtonLoading: false,
        },
    },
    getters: {},
    mutations: {},
    actions: {
        addBallChargeData({ commit }, data) {
            return axios.post("/rawMaterials/ballCharge", data).then((res) => {
                console.log(res);
            });
        },
        getBallChargeData({ commit }) {
            return axios.get("/rawMaterials/getBallCharges").then((res) => {
                console.log(res);
            });
        },
    },
};
