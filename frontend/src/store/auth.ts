// /src/store/auth.ts
import { authService } from "@/services/auth.service";

const state = {
  accessToken: null,
  loggedIn: false,
};

const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },

  setLoggedIn(state, loggedIn) {
    state.loggedIn = loggedIn;
  },
  logout(state) {
    state.accessToken = null;
    state.loggedIn = false;
    localStorage.removeItem("access_token");
  },
};

const actions = {
  async checkLoginStatus({ commit }) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      try {
        // Gọi API hoặc thực hiện các bước cần thiết để xác minh access_token
        // ...
        // Nếu xác minh thành công, cập nhật store với thông tin đăng nhập
        commit("setAccessToken", access_token);
        commit("setLoggedIn", true);
      } catch (error) {
        // Xử lý lỗi nếu cần
        return
      }
    }
  },
  async login({ commit }, credentials) {
    try {
      // Gọi API để đăng nhập và nhận về access_token
      const access_token = await authService.login(credentials);
      commit("setAccessToken", access_token);
      commit("setLoggedIn", true);
      localStorage.setItem("access_token", access_token);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error during login:", error);
    }
  },
  async register({ commit }, credentials) {
    try {
      const access_token = await authService.register(credentials);
    } catch (error) {
      console.error("Error during login:", error);
    }
  },
  async logout({ commit }) {
    try {
      commit("logout");
    } catch (error) {
      console.error("Error during login:", error);
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
