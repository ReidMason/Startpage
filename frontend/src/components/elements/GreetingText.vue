<template>
  <h1 class="text-5xl font-bold">{{ greeting }}</h1>
</template>

<script>
export default {
  name: "GreetingText",
  props: {
    d: Date
  },
  computed: {
    greeting: function() {
      const greetings = {
        0: "Good night!",
        1: "Good morning!",
        2: "Good afternoon!",
        3: "Good evening!"
      };
      return greetings[Math.floor(this.d.getHours() / 6)];
    }
  }
};
</script>
