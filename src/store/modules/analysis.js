import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

const resolveBigbagSerial = (item) => {
    let str = item.bigbagNo.toString();
    let bigbagNo = str.slice(-8);
    let product = str.slice(0, -8);

    let dateArr = bigbagNo.slice(0, 6).split("");
    dateArr.splice(2, 0, "-");
    dateArr.splice(5, 0, "-");
    let dateStr = dateArr.join("");
    let bigbagDate = "20" + dateStr.split("-").reverse().join("-");

    let bigbagShift = bigbagNo[6];
    let bigbagIndex = bigbagNo[7];

    let bigbagQueue = parseInt(
        new Date(bigbagDate).getTime().toString() +
            bigbagShift.toString() +
            bigbagIndex.toString()
    );

    item.product = product;
    item.bigbagDate = new Date(bigbagDate);
    item.bigbagShift = bigbagShift;
    item.bigbagIndex = bigbagIndex;
    item.bigbagQueue = bigbagQueue;
};

export default {
    namespaced: true,
    state: {
        analysis3060Mesh: [],
        analysis80Mesh: [],
        analysis180Mesh: [],
        buttons: {
            analysis80MeshSaveButtonLoading: false,
        },
    },
    getters: {},
    mutations: {
        SET_80_MESH: (state, data) => {
            data.forEach((item) => {
                resolveBigbagSerial(item);
            });
            state.analysis80Mesh = [...data];
        },
        ADD_80_MESH: (state, data) => {
            data.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(data);
            state.analysis80Mesh.push(Object.assign({}, data));
            state.buttons.analysis80MeshSaveButtonLoading = false;
        },
        UPDATE_80_MESH: (state, data) => {
            let found = state.analysis80Mesh.find((itm) => itm.id == data.id);

            found.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(found);
            found.p400 = data.p400;
            found.m212 = data.m212;
            found.m160 = data.m160;
            found.notes = data.notes;

            state.buttons.analysis80MeshSaveButtonLoading = false;
        },
        DELETE_80_MESH: (state, id) => {
            let index = state.analysis80Mesh.findIndex((itm) => itm.id == id);
            state.analysis80Mesh.splice(index, 1);
        },
    },
    actions: {
        async save3060Mesh({ commit }, data) {
            console.log(data);
            return axios
                .post("/analysis/save3060Mesh", data)
                .then(async (result) => {
                    console.log(result);
                });
        },

        async get80Mesh({ commit }) {
            return axios.get("/analysis/get80Mesh").then(async (result) => {
                await commit("SET_80_MESH", result.data);
            });
        },
        async save80Mesh({ commit, state }, data) {
            state.buttons.analysis80MeshSaveButtonLoading = true;
            return axios
                .post("/analysis/save80Mesh", data)
                .then(async (result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        await commit("ADD_80_MESH", data);
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        async update80Mesh({ commit, state }, data) {
            state.buttons.analysis80MeshSaveButtonLoading = true;
            return axios
                .put("/analysis/update80Mesh", data)
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("UPDATE_80_MESH", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                });
        },
        async delete80Mesh({ commit }, id) {
            return axios
                .delete("/analysis/delete80Mesh", { data: { id } })
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("DELETE_80_MESH", id);
                        return true;
                    }
                });
        },

        async save180Mesh({ commit }, data) {
            console.log(data);
            return axios
                .post("/analysis/save180Mesh", data)
                .then(async (result) => {
                    console.log(result);
                });
        },
    },
};
