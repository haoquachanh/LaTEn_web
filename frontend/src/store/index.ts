// /src/store/index.ts
import { createStore } from "vuex";
import auth from "./auth";
import user from "./user";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    auth: auth,
    user: user,
  },
  // plugins: [createPersistedState()],
});

export default store;
