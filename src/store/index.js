import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

let user = window.localStorage.getItem("user");
let authed = window.localStorage.getItem("authed");

export default new Vuex.Store({
  state: {
    user: user ? JSON.parse(user) : null,
    authed: authed ? authed : false,
  },
  mutations: {
    addUserData(state, data) {
      //set user data
      state.user = data;

      //set auth state
      state.authed = true;

      //save to local storage
      this.commit("saveUserData");
    },

    saveUserData(state) {
      window.localStorage.setItem("user", JSON.stringify(state.user));
      window.localStorage.setItem("authed", true);
    },

    logoutUser(state) {
      //set user data
      state.user = null;

      //set auth state
      state.authed = false;

      //remove from local storage
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("authed");
    },
  },
  actions: {},
  modules: {},
});
