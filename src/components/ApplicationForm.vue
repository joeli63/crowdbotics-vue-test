<template>
  <div class="container pt-5 mt-5">
    <loading-spinner :loading="loading">
      <b-form @submit.prevent="saveApp" enctype="'multipart/form-data'">
        <h2 class="text-muted mb-4 text-center">Application information</h2>

        <b-row class="mt-5">
          <b-col>
            <b-form-group label="Enter your name" label-for="name">
              <b-form-input
                id="name"
                v-model="app.name"
                type="text"
                placeholder="please write name"
                name="name"
                v-validate="'required|min:1|max:50'"
                :class="{ 'input-error': errors.has('password') }"
              />
              <small v-if="errors.has('name')" class="text-danger">{{
                errors.first("name")
              }}</small>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              label="Enter your description"
              label-for="description"
            >
              <b-form-input
                id="description"
                v-model="app.description"
                type="text"
                placeholder="please write description"
                name="description"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group label="Enter your type" label-for="type">
              <b-form-select
                id="type"
                v-model="app.type"
                type="text"
                placeholder="please write type"
                name="type"
                v-validate="'required'"
                :options="type"
                :class="{ 'input-error': errors.has('password') }"
              ></b-form-select>
              <small v-if="errors.has('type')" class="text-danger">{{
                errors.first("type")
              }}</small>
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group label="Enter your framework" label-for="framework">
              <b-form-select
                id="framework"
                v-model="app.framework"
                type="text"
                placeholder="please write framework"
                name="framework"
                v-validate="'required'"
                :options="framework"
              ></b-form-select>
              <small v-if="errors.has('framework')" class="text-danger">{{
                errors.first("framework")
              }}</small>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group
              label="Enter your domain name"
              label-for="domain_name"
            >
              <b-form-input
                id="domain_name"
                v-model="app.domain_name"
                type="text"
                placeholder="please write domain name"
                name="domain_name"
              />
            </b-form-group>
          </b-col>

          <b-col>
            <b-form-group
              label="Enter your screen shot"
              label-for="screen shot"
            >
              <b-form-file
                id="screenshot"
                type="text"
                placeholder="please write screenshot"
                name="screenshot"
              ></b-form-file>
              <small v-if="errors.has('screenshot')" class="text-danger">{{
                errors.first("screenshot")
              }}</small>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="justify-content-center mt-5 action">
          <loading-spinner :loading="btnLoading">
            <button type="submit" class="form-control btn btn-danger w-50">
              {{ app.id ? "UPDATE" : "CREATE" }}
            </button>
          </loading-spinner>
        </b-row>
      </b-form>
    </loading-spinner>
  </div>
</template>

<script>
import constants from "@/services/constants.js";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapState } from "vuex";

export default {
  name: "ApplicationForm",
  components: {
    LoadingSpinner
  },
  data() {
    return {
      type: constants.types,
      framework: constants.frameworks,
      loading: false,
      btnLoading: false
    };
  },
  computed: {
    ...mapState("app", ["app"])
  },
  async created() {
    this.loading = true;
    const appId = this.$route.params.id;

    await this.$store.dispatch("app/getApp", appId);
    this.loading = false;
  },
  methods: {
    async saveApp() {
      this.btnLoading = true;
      const appId = this.$route.params.id;
      const imagefile = document.querySelector("#screenshot").files[0];

      const formData = new FormData();

      if (appId !== "create")
        await this.$store.dispatch("app/updateApp", {
          ...this.app,
          screenshot: imagefile
        });
      else {
        // eslint-disable-next-line no-unused-vars
        const { plan, subscription, ...params } = this.app;
        Object.entries(params).forEach(([key, value]) => {
          formData.append(key, value);
        });

        await this.$store.dispatch("app/createApp", formData);
        this.$store.commit("showNotification", {
          type: "info",
          message: "App was created successfully"
        });
        this.$router.push({ name: "dashboard" });
      }
      this.btnLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.action .loading-spinner {
  text-align: center;
}
</style>
