import store from "../store/index";
export default {
  methods: {
    accessSettings() {
      let list = [1, 2];
      if (store.state.users.user == null) {
        return false;
      }
      return list.includes(store.state.users.user.role);
    },
  },
};
