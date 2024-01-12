// /src/store/dictionary.ts
import { dictionaryService } from "@/services/dictionary.service";

const state = {
  accessToken: null,
  loggedIn: false,
};

const actions = {  
  async search({ commit }) {
    try {
      await dictionaryService.search(word)
    } catch (error) {
      return
    }
  },

};

export default {
  state,
  actions,
};
