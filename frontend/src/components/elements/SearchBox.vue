<template>
  <div class="mx-auto w-10/12 md:w-5/6 lg:w-full px-4">
    <form @submit.prevent="search">
      <input
        class="w-full mb-10 h-20 text-3xl bg-transparent border-b outline-none"
        v-model="searchTerm"
        spellcheck="false"
        autofocus
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  data: function() {
    return {
      searchTerm: ""
    };
  },
  props: {
    providers: Array,
    config: Object
  },
  methods: {
    search: function() {
      var searchTerm = this.searchTerm.trim();

      // Ignore blank search term
      if (searchTerm === "") {
        this.searchTerm = "";
        return;
      }

      // Not a command so just search the text
      if (searchTerm[0] !== "/") {
        window.location =
          this.config.general.searchUrl + encodeURIComponent(searchTerm);
        return;
      }

      var prefix =
        searchTerm.substr(1, searchTerm.indexOf(" ") - 1) ||
        searchTerm.substr(1);
      var searchText = encodeURIComponent(
        this.searchTerm.substr(2 + prefix.length)
      );

      // Now we are going to run the command
      this.providers.forEach(provider => {
        if (provider.prefix === prefix) {
          // If there is a space after the command we're doing a search
          if (searchTerm.indexOf(" ") > -1) {
            window.location = provider.searchUrl + searchText;
          } else {
            // If there isn't a space go to the base url
            window.location = provider.baseUrl;
          }
          return;
        }
      });
    }
  }
};
</script>

<style scoped>
input {
  border-color: var(--nord9);
}
</style>