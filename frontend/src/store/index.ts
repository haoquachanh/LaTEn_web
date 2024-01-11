// /src/store/index.ts
import { createStore } from "vuex";
import authModule from "./auth";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    auth: authModule,
  },
  plugins: [createPersistedState()],
});

export default store;
