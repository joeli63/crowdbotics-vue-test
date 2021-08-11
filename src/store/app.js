import * as appApi from "@/apis/app";
import Vue from "vue";

const state = {
  appList: [],
  app: {},
  planList: [],
  plan: 1,
  subscriptionList: [],
  subscription: {},
  errors: [],
  isActive: true
};

const showNotification = (commit, data) => {
  /**
   *  combine error messages.
   *  - email: ["A user is already registered with this e-mail address."]
   */
  const message = Object.keys(data)
    .map(key => data[key])
    .join(",");

  commit(
    "showNotification",
    { type: "danger", message },
    {
      root: true
    }
  );
};

const getters = {
  apps: state => state.appList,
  getIsActive: state => state.isActive,
  app: state => state.app,
  planListGetter: state => state.planList,
  subscriptionGetter: state => state.subscription,
  planGetter: state => state.plan
};

const actions = {
  async getAppsList({ commit }) {
    const { data } = await appApi.appsList();

    commit("setAppList", data);
  },

  async getApp({ commit }, id) {
    if (id === "create") {
      commit("setApp", {
        name: "",
        description: "",
        type: "",
        framework: "",
        domain_name: "",
        subscription: "",
        screenshot: "",
        plan: ""
      });
    } else {
      const { data } = await appApi.getApp(id);

      if (data?.id) {
        commit("setApp", data);
      } else {
        showNotification(commit, data);
      }
    }
  },

  async createApp({ commit }, input) {
    const res = await appApi.createApp(input);

    if (res.data.id) {
      commit("setApp", res.data);
    } else {
      showNotification(commit, res.data);
    }
  },

  async updateApp({ commit }, id) {
    const { data } = await appApi.updateApp(id);

    commit("setApp", data);
    return data;
  },

  async deleteApp({ commit }, id) {
    const { data } = await appApi.updateApp(id);

    commit("setApp", {});
    return data;
  },

  async getPlanList({ commit }) {
    const { data } = await appApi.plansList();

    commit("setPlanList", data);
    return data;
  },

  async getPlan({ commit }, id) {
    const { data } = await appApi.getPlan(id);

    commit("setPlan", data);
    return data;
  },

  async getSubscriptionList({ commit }) {
    const { data } = await appApi.getSubscriptionList();

    commit("setSubscriptionList", data);
  },

  async getSubscription({ commit }, id) {
    const { data } = await appApi.getSubscription(id);

    commit("setSubscription", data);
  },

  async createSubscription({ commit }, input) {
    const { data } = await appApi.createSubscription(input);

    commit("setSubscription", data);
    return data;
  },

  async updateSubscription({ commit }, input) {
    const { data } = await appApi.updateSubscription(input);

    commit("setSubscription", data);
    return data;
  }
};

const mutations = {
  setAppList(state, data) {
    Vue.set(state, "appList", data);
  },

  setApp(state, data) {
    Vue.set(state, "app", data);
  },

  setPlanList(state, data) {
    Vue.set(state, "planList", data);
  },

  setPlan(state, data) {
    Vue.set(state, "plan", data);
  },

  setSubscriptionList(state, data) {
    Vue.set(state, "subscriptionList", data);
  },

  setSubscription(state, data) {
    Vue.set(state, "subscription", data);
    Vue.set(state, "plan", data.plan);
  },
  /***
   * enable or disable activation of tab.
   */
  activate(state, value) {
    Vue.set(state, "isActive", value);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
