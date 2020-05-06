<template>
  <div class="container mx-auto mt-20 text-white">
    <search-box :providers="providers" :config="config" />
    <div class="flex justify-between mx-auto w-10/12 md:w-5/6 lg:w-full lg:m-0 pb-5 px-4">
      <div>
        <date-text :d="date" />
        <greeting-text :d="date" />
      </div>
      <div>
        <weather :config="config" :endpoint="endpoint" v-if="config.weather.enabled" />
      </div>
    </div>
    <apps :apps="apps" />
    <hr class="mx-auto w-1/2 mb-12" />
    <unifi :config="config" :endpoint="endpoint" v-if="config.unifi.enabled" />
  </div>
</template>

<script>
import DateText from "./components/elements/DateText";
import GreetingText from "./components/elements/GreetingText";
import SearchBox from "./components/elements/SearchBox";
import Apps from "./components/elements/Apps";
import Weather from "./components/elements/Weather";
import Unifi from "./components/elements/Unifi";
import axios from "axios";

// Load data
// import providers from "../../data/providers.json";
// import apps from "../../data/apps.json";
// import config from "../../data/config.json";

export default {
  name: "App",
  components: {
    DateText,
    GreetingText,
    SearchBox,
    Apps,
    Weather,
    Unifi
  },
  data: function() {
    return {
      endpoint: "http://localhost:5003/api",
      date: new Date(),
      providers: null,
      apps: null,
      config: null
    };
  },
  methods: {
    getProviders() {
      axios.get(`${this.endpoint}/data/providers.json`).then(response => {
        this.providers = response.data;
      });
    },
    getApps() {
      axios.get(`${this.endpoint}/data/apps.json`).then(response => {
        this.apps = response.data;
      });
    },
    getConfig() {
      axios.get(`${this.endpoint}/data/config.json`).then(response => {
        this.config = response.data;
      });
    }
  },
  mounted: function() {
    this.getProviders();
    this.getApps();
    this.getConfig();
  }
};
</script>

<style>
@import "assets/styles/nord.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.url,
.ip {
  color: var(--nord8);
}

hr {
  height: 1px;
  background-color: var(--nord8);
  border: none;
}

.app-background:hover {
  background-color: var(--nord1);
}

.iconify {
  color: var(--nord8);
}
</style>
