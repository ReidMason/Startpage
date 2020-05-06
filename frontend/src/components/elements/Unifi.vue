<template>
  <transition name="fade">
    <div v-if="clientData">
      <!-- <h1 class="text-2xl px-4 mb-2">Network</h1> -->
      <div div class="flex flex-wrap content-center mx-auto w-10/12 md:w-5/6 lg:w-full lg:m-0">
        <div
          v-for="client in clientData"
          :key="client.ip"
          class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 pt-0"
        >
          <h5 class="ml-2">{{ client.name }}</h5>
          <p class="ml-2 text-xs ip mb-1">{{ client.ip }}</p>

          <div>
            <span class="inline-block align-middle iconify text-3xl" data-icon="jam-download"></span>
            <h5 class="inline-block align-top mr-2">{{ client.download }}</h5>
            <span class="inline-block align-middle iconify text-3xl" data-icon="jam-upload"></span>
            <h5 class="inline-block align-top">{{ client.upload }}</h5>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";

export default {
  name: "Unifi",
  data: function() {
    return {
      clientData: null
    };
  },
  props: {
    endpoint: String,
    config: Object
  },
  methods: {
    getClientData: function() {
      var url;
      if (this.config.unifi.showAllClients) {
        url = `${this.endpoint}/unifi/networkData/all`;
      } else if (this.config.unifi.hostnames.length !== 0) {
        var hostnames = this.config.unifi.hostnames.join("&hostname=");
        url = `${this.endpoint}/unifi/networkData?hostname=${hostnames}`;
      }
      if (url !== undefined) {
        axios
          .get(url)
          .then(response => {
            this.clientData = response.data;
          })
          .catch(() => {
            console.log("Error getting unifi data");
          });
      }
    }
  },
  mounted: function() {
    this.getClientData();
  }
};
</script>

