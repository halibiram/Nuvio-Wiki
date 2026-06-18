<script setup lang="ts">
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="back-to-top-wrap">
    <button class="back-to-top" type="button" @click="backToTop">
      <span aria-hidden="true">&uarr;</span>
      Back to top
    </button>
  </div>
</template>
