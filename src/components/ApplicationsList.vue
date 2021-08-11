<template>
  <div class="container mt-3">
    <h2 class="text-muted  my-5">Apps List</h2>

    <b-row>
      <b-col sm="3" class="d-flex justify-content-center align-items-center">
        <b-input-group size="sm">
          <b-input-group-prepend is-text>
            <b-icon icon="search" />
          </b-input-group-prepend>

          <b-form-input
            type="search"
            placeholder="Search app name"
            id="filter-input"
            v-model="filter"
          />
        </b-input-group>
      </b-col>

      <b-col class="text-right">
        <b-button variant="primary" @click="createApplication"
          >create app</b-button
        >
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-table
        :items="apps"
        select-mode="single"
        :fields="fieldsName"
        :busy="isBusy"
        :filter="filter"
        empty-text="No data"
        @filtered="onFiltered"
        show-empty
      >
        <template #cell(name)="{item}">
          <div>
            <b-link @click.prevent="show(item.operation)">{{
              item.name
            }}</b-link>
            <div>{{ item.type + " / " + item.framework }}</div>
          </div>
        </template>

        <template #cell(screenshot)="{item}">
          <b-img
            :src="getImageUrl(item.screenshot)"
            width="75"
            height="75"
          ></b-img>
        </template>

        <template #cell(action)>
          action
        </template>
      </b-table>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      fieldsName: [
        { key: "name", label: "name", filterByFormatted: true },
        { key: "description", label: "description" },
        { key: "domainName", label: "domain name" },
        { key: "screenshot", label: "screenshot" },
        { key: "subscription", label: "subscription" },
        { key: "action", label: "" }
      ],
      options: [{ text: "deployed", value: "deployed" }],
      isBusy: true,
      items: [],
      filter: null
    };
  },

  computed: {
    ...mapGetters({
      apps: "app/apps",
      subscriptions: "app/subscriptionGetter"
    })
  },

  methods: {
    async update(id) {
      await this.$store.dispatch("getApp", id);
      this.$router.push("/application");
    },

    deploy(id) {
      console.log(id);
    },

    async show(id) {
      await this.$store.dispatch("getApp", id);
      const app = this.getAppInfo;
      console.log(app.subscription);
      if (app?.subscription)
        await this.$store.dispatch("getSubscription", app.subscription);
      else await this.$store.commit("setSubscription", { plan: 1 });
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },

    mapPropsToState() {
      const appsList = this.appListGetter;
      let data = [];

      if (appsList.length > 0) {
        for (let i = 0; i < appsList.length; i++) {
          let index = i + 1;
          let operation = appsList[i]["id"];
          let name = appsList[i]["name"];
          let type = appsList[i]["type"];
          let framework = appsList[i]["framework"];
          let deployed = false;
          data.push({ index, name, type, deployed, operation, framework });
        }
      }
      this.items = data;
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    createApplication() {
      this.$router.push({
        name: "application",
        params: {
          id: "create"
        }
      });
    },

    getImageUrl(url) {
      if (url) {
        console.log(url.split("?")[0]);
        return url.split("?")[0];
      } else {
        return "https://via.placeholder.com/150";
      }
    }
  },

  watch: {
    appListGetter: {
      deep: true,
      handler: function() {
        this.mapPropsToState();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.h-30 {
  height: 30px;
}
</style>
