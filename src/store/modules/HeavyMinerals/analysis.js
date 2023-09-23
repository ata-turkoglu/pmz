import axios from "@/plugins/axios";

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
            analysis3060MeshSaveButtonLoading: false,
            analysis80MeshSaveButtonLoading: false,
            analysis180MeshSaveButtonLoading: false,
        },
    },
    getters: {},
    mutations: {
        SET_3060_MESH: (state, data) => {
            data.forEach((item) => {
                resolveBigbagSerial(item);
            });
            state.analysis3060Mesh = [...data];
        },
        ADD_3060_MESH: (state, data) => {
            data.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(data);
            state.analysis3060Mesh.push(Object.assign({}, data));
            state.buttons.analysis3060MeshSaveButtonLoading = false;
        },
        UPDATE_3060_MESH: (state, data) => {
            let found = state.analysis3060Mesh.find((itm) => itm.id == data.id);

            found.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(found);
            found.p600 = data.p600;
            found.p400 = data.p400;
            found.m212 = data.m212;
            found.notes = data.notes;

            state.buttons.analysis3060MeshSaveButtonLoading = false;
        },
        DELETE_3060_MESH: (state, id) => {
            let index = state.analysis3060Mesh.findIndex((itm) => itm.id == id);
            state.analysis3060Mesh.splice(index, 1);
        },

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

        SET_180_MESH: (state, data) => {
            data.forEach((item) => {
                resolveBigbagSerial(item);
            });
            state.analysis180Mesh = [...data];
        },
        ADD_180_MESH: (state, data) => {
            data.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(data);
            state.analysis180Mesh.push(Object.assign({}, data));
            state.buttons.analysis180MeshSaveButtonLoading = false;
        },
        UPDATE_180_MESH: (state, data) => {
            let found = state.analysis180Mesh.find((itm) => itm.id == data.id);

            found.bigbagNo = parseInt(data.bigbagNo);
            resolveBigbagSerial(found);
            found.p212 = data.p212;
            found.p160 = data.p160;
            found.m90 = data.m90;
            found.notes = data.notes;

            state.buttons.analysis180MeshSaveButtonLoading = false;
        },
        DELETE_180_MESH: (state, id) => {
            let index = state.analysis180Mesh.findIndex((itm) => itm.id == id);
            state.analysis180Mesh.splice(index, 1);
        },
    },
    actions: {
        async get3060Mesh({ commit }) {
            return axios.get("/analysis/get3060Mesh").then(async (result) => {
                await commit("SET_3060_MESH", result.data);
            });
        },
        async save3060Mesh({ commit }, data) {
            return axios
                .post("/analysis/save3060Mesh", data)
                .then(async (result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        await commit("ADD_3060_MESH", data);
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        async update3060Mesh({ commit, state }, data) {
            state.buttons.analysis3060MeshSaveButtonLoading = true;
            return axios
                .put("/analysis/update3060Mesh", data)
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("UPDATE_3060_MESH", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                });
        },
        async delete3060Mesh({ commit }, id) {
            return axios
                .delete("/analysis/delete3060Mesh", { data: { id } })
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("DELETE_3060_MESH", id);
                        return true;
                    }
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

        async get180Mesh({ commit }) {
            return axios.get("/analysis/get180Mesh").then(async (result) => {
                await commit("SET_180_MESH", result.data);
            });
        },
        async save180Mesh({ commit }, data) {
            return axios
                .post("/analysis/save180Mesh", data)
                .then(async (result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        await commit("ADD_180_MESH", data);
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        async update180Mesh({ commit, state }, data) {
            state.buttons.analysis180MeshSaveButtonLoading = true;
            return axios
                .put("/analysis/update180Mesh", data)
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("UPDATE_180_MESH", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                });
        },
        async delete180Mesh({ commit }, id) {
            return axios
                .delete("/analysis/delete180Mesh", { data: { id } })
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("DELETE_180_MESH", id);
                        return true;
                    }
                });
        },
    },
};
