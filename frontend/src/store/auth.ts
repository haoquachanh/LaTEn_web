import { reactive } from 'vue';
import { authService } from '../services/auth.service';

const state = reactive({
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
});

const mutations = {
  setTokens: (accessToken: string, refreshToken: string) => {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.isAuthenticated = true;
  },
  clearTokens: () => {
    state.accessToken = '';
    state.refreshToken = '';
    state.isAuthenticated = false;
  },
};

const actions = {
  login: async (username: string, password: string) => {
    try {
      const { accessToken, refreshToken } = await authService.login(username, password);
      mutations.setTokens(accessToken, refreshToken);
    } catch (error) {
      console.error('Login failed', error);
    }
  },
  refreshToken: async () => {
    try {
      const { accessToken, refreshToken } = await authService.refreshToken(state.refreshToken);
      mutations.setTokens(accessToken, refreshToken);
    } catch (error) {
      console.error('Refresh token failed', error);
      mutations.clearTokens();
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
