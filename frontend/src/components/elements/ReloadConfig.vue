<template>
  <div
    class="flex absolute bottom-0 left-0 mb-2 ml-2"
    @mouseover="rolledOver = true"
    @mouseleave="rolledOver = false"
    @click="reloadConfig"
  >
    <span class="iconify text-4xl fade cursor-pointer mr-1" data-icon="mdi-refresh-circle"></span>
    <transition name="fade">
      <p class="my-auto" v-if="rolledOver">Reload Settings</p>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ReloadConfig",
  data: function() {
    return {
      rolledOver: false
    };
  }
};
</script>

<style scoped>
.fade {
  opacity: 0.25;
  transition: opacity 0.3s;
}

.fade:hover {
  opacity: 1;
}
</style>