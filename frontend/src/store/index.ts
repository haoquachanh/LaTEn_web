// /src/store/index.ts
import { createStore } from "vuex";
import auth from "./auth";
import user from "./user";
import createPersistedState from "vuex-persistedstate";
import dictionary from "./dictionary";

const store = createStore({
  modules: {
    auth: auth,
    user: user,
    dictionary: dictionary
  },
  // plugins: [createPersistedState()],
});

export default store;
