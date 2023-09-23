import axios from "@/plugins/axios";
import moment from "moment";
import store from "../../index";

export default {
    namespaced: true,
    state: {
        productionDataByDateRange: [],
    },
    getters: {},
    mutations: {
        SET_PRODUCTION_DATA: (state, data) => {
            let list = [];
            data.forEach((item) => {
                let product = store.getters["getDbProduct"](item.product);
                let packaging = store.getters["getDbProductPackaging"](
                    item.package
                );
                let obj = {
                    date: moment(item.workday).format("YYYY-MM-DD"),
                    productId: product.id,
                    product: product.product,
                    definition: product.definition,
                    amount: item.amount,
                    packagingId: packaging.id,
                    packaging: packaging.package_name,
                    totalWeight: (item.amount * packaging.weight) / 1000,
                };
                let found = list.find(
                    (itm) =>
                        itm.date == obj.date &&
                        itm.productId == obj.productId &&
                        itm.packagingId == obj.packagingId
                );
                if (found) {
                    found.amount += obj.amount;
                    found.totalWeight =
                        (found.amount * packaging.weight) / 1000;
                } else {
                    list.push(obj);
                }
            });
            state.productionDataByDateRange = list;
        },
    },
    actions: {
        async getProductionDataByDateRange(
            { commit },
            { facility, startDate, endDate }
        ) {
            return axios
                .get("/production/productionByDateRange", {
                    params: { facility, startDate, endDate },
                })
                .then((result) => {
                    commit("SET_PRODUCTION_DATA", result.data);
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },
    },
};
