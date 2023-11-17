import { createStore } from 'vuex';
import { VueCookieNext } from 'vue-cookie-next';

export interface User {
  username: string;
  age?: number;
  id: number;
  fullname: string;
  avt: string;
}

const store = createStore({
  state() {
    return {
      token: VueCookieNext.getCookie('token') || '',
      user: VueCookieNext.getCookie('user') || '',
    };
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
      VueCookieNext.setCookie('token', token, { expire: '1d' });
    },
    setUser(state, user: string) {
      state.user = user;
      VueCookieNext.setCookie('user', user, { expire: '1d' });
    },

    clearStore(state) {
      state.token = '';
      state.user = '';
      VueCookieNext.removeCookie('token');
      VueCookieNext.removeCookie('user');
    },
  },
  actions: {
    login({ commit }, { token, user }: { token: string; user: string }) {
      commit('setToken', token);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('clearStore');
    },
  },
  getters: {
    getToken: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
  },
});

export default store;
