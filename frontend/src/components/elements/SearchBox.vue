<template>
  <div class="mx-auto w-10/12 md:w-5/6 lg:w-full px-4">
    <form @submit.prevent="search">
      <input
        class="w-full mb-10 h-20 text-3xl bg-transparent border-b outline-none"
        v-model="rawSearchTerm"
        spellcheck="false"
        autofocus
      />
    </form>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  data: function () {
    return {
      rawSearchTerm: "",
    };
  },
  props: {
    providers: Array,
    config: Object,
  },
  methods: {
    search: function () {
      // Ignore blank search term
      if (this.searchTerm === "") {
        this.rawSearchTerm = "";
        return;
      }

      // Not a command so just search the text
      if (this.searchTerm[0] !== "/") {
        this.performGoogleSearch();
        return;
      }

      // Try and search using the providers
      if (!this.attemptProviderSearch()) {
        // If we are here then there were no providers that matched the term so just google search instead
        this.performGoogleSearch();
      }
    },
    performGoogleSearch() {
      window.location =
        this.config.general.searchUrl + encodeURIComponent(this.searchTerm);
    },
    attemptProviderSearch() {
      // This might be "a" for amazon or "yt" for youtube
      let prefix =
        this.searchTerm.substr(1, this.searchTerm.indexOf(" ") - 1) ||
        this.searchTerm.substr(1);
      // This is the term being searched for
      let searchText = encodeURIComponent(
        this.searchTerm.substr(2 + prefix.length)
      );

      // Now we are going to run the command
      for (let provider of this.providers) {
        if (provider.prefix === prefix) {
          // If there is a space after the command we're doing a search
          if (this.searchTerm.indexOf(" ") > -1) {
            window.location = provider.searchUrl + searchText;
          } else {
            // If there isn't a space go to the base url
            window.location = provider.baseUrl;
          }
          return true;
        }
      }
    },
  },
  computed: {
    searchTerm() {
      return this.rawSearchTerm.trim();
    },
  },
};
</script>

<style scoped>
input {
  border-color: var(--nord9);
}
</style>