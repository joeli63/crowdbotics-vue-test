<template>
  <div class="m-2">
    <b-card
      :title="plan && plan.description ? plan.description : ''"
      :sub-title="plan && plan.name ? plan.name : ''"
      :border-variant="selected ? 'primary' : ''"
      class="d-flex text-center sidebar-card"
    >
      <b-card-text>
        {{ plan && plan.price ? plan.price : "" }}
      </b-card-text>
      <b-list-group>
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon> and launch unlimited
          applications</b-list-group-item
        >
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon>GitHub
          integration</b-list-group-item
        >
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon>Free web app hosting with
          Crowdbotics domain</b-list-group-item
        >
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon>PostgreSQL storage with up
          to 1000 rows of data</b-list-group-item
        >
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon>Application hosting on
          Heroku</b-list-group-item
        >
        <b-list-group-item
          ><b-icon check variant="primary"></b-icon>Community forum
          support</b-list-group-item
        >
      </b-list-group>
      <b-button
        class="mt-2"
        variant="primary"
        @click.prevent="selectPlan(plan.id)"
        >{{ selected ? "current" : "select" }}</b-button
      >
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    plan: Object
  },
  data() {
    return {
      planId: 1
    };
  },
  computed: {
    ...mapGetters({
      getAppInfo: "app/getAppInfo",
      subscriptionGetter: "app/subscriptionGetter"
    }),
    selected() {
      return this.plan?.id === this.planId;
    }
  },
  methods: {
    async selectPlan(id) {
      let subscription = this.subscriptionGetter;
      if (subscription?.id) {
        subscription.plan = id;
        await this.$store.dispatch("updateSubscription", subscription);
      } else {
        await this.$store.dispatch("createSubscription", {
          plan: id,
          app: this.getAppInfo.id,
          active: true
        });
      }
    },
    setPlanId() {
      this.planId = this.subscriptionGetter.plan;
    }
  },
  watch: {
    subscriptionGetter: {
      deep: true,
      handler: function() {
        this.setPlanId();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-card {
  width: 300px;
}
</style>
