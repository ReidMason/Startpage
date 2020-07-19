<template>
  <div class="flex flex-wrap content-center mx-auto w-10/12 md:w-5/6 lg:w-full mb-6">
    <div v-for="app in apps" :key="app.name" class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 pt-0">
      <div
        class="app-background p-2 hover:shadow-lg rounded cursor-pointer"
        @click="openUrl(app.url)"
        @click.middle="openUrlNewTab(app.url)"
      >
        <div class="inline-block">
          <span class="iconify text-4xl" :data-icon="app.icon"></span>
        </div>
        <div class="inline-block pl-2 font-medium">
          <p class="lowercase">{{ app.name }}</p>
          <p class="text-xs url">{{ app.url.replace(/^https?:\/\//gi, "").split("/", 1)[0] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Apps",
  props: {
    apps: Array
  },
  methods: {
    openUrl: function(url) {
      window.location = url;
    },
    openUrlNewTab: function(url) {
      window.open(url, "_blank");
    }
  }
};
</script>