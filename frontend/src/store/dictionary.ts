// /src/store/dictionary.ts
import { dictionaryService } from "@/services/dictionary.service";

const state = {
  accessToken: null,
  loggedIn: false,
};

const actions = {  
  async search({ commit }, key:{ word: string, language: string}) {
    try {
      await dictionaryService.search(key)
    } catch (error) {
      return
    }
  },

};

export default {
  state,
  actions,
};
