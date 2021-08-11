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
        <b-button variant="primary" @click="createApp">create app</b-button>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <loading-spinner :loading="loading">
        <b-table
          :items="apps"
          select-mode="single"
          :fields="fieldsName"
          :filter="filter"
          :busy="listLoading"
          empty-text="No data"
          @filtered="onFiltered"
          show-empty
        >
          <template #cell(name)="{item}">
            <div>
              <b-link @click.prevent="updateApp(item.id)">{{
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

          <template #cell(plan)="{item}">
            {{ getPlan(item.id) }}
          </template>

          <template #cell(action)="{item}">
            <b-button
              pill
              variant="outline-danger"
              size="sm"
              @click="updateApp(item.id)"
              class="px-4 mx-2"
            >
              Update
            </b-button>

            <b-button
              pill
              variant="outline-primary"
              size="sm"
              @click="selectPlan(item.id)"
              class="px-4 mx-2"
            >
              Select plan
            </b-button>
          </template>
        </b-table>
      </loading-spinner>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as appApi from "@/apis/app";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  name: "ApplicationList",

  components: {
    LoadingSpinner
  },

  async mounted() {
    this.listLoading = true;
    await this.$store.dispatch("app/getAppsList");
    await this.$store.dispatch("app/getPlanList");
    this.listLoading = false;
  },

  data() {
    return {
      fieldsName: [
        { key: "name", label: "Name", filterByFormatted: true },
        { key: "description", label: "Description" },
        { key: "domain_name", label: "Domain name" },
        { key: "screenshot", label: "Screenshot" },
        { key: "action", label: "Action" }
      ],
      loading: false,
      listLoading: false,
      filter: null
    };
  },

  computed: {
    ...mapGetters({
      apps: "app/apps",
      subscription: "app/subscription",
      app: "app/app"
    })
  },

  methods: {
    updateApp(id) {
      this.$router.push({ name: "application", params: { id } });
    },

    createApp() {
      this.$router.push({
        name: "application",
        params: {
          id: "create"
        }
      });
    },

    async selectPlan(id) {
      this.loading = true;

      const { data } = await appApi.getApp(id);
      this.$store.commit("app/setApp", data);

      if (data?.subscription)
        await this.$store.dispatch(
          "app/getSubscription",
          this.app.subscription
        );
      else this.$store.commit("app/setSubscription", { plan: 1 });

      this.loading = false;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    getImageUrl(url) {
      if (url) {
        return url.split("?")[0];
      } else {
        return "https://via.placeholder.com/150";
      }
    }
  }
};
</script>
