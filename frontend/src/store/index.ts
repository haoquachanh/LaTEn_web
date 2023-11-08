import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      // Trạng thái của ứng dụng
      token: localStorage.getItem('token') || "",
    };
  },
  mutations: {
    setToken(state, token:string) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  actions:{
    login({ commit }, token: string) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    },
  }
});

export default store;