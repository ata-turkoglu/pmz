import Axios from "axios";

const axios = Axios.create({
    baseURL:
        process.env.NODE_ENV == "development"
            ? process.env.VUE_APP_BACKEND_DEV
            : process.env.VUE_APP_BACKEND,
});

export default axios;
