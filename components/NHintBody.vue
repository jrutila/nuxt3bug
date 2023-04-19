<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div data-nosnippet>
    <component :is="renderedText" />
  </div>
</template>

<script setup>
import { NHello } from "#components"

const dynamicallyGeneratedText = "Hello <n-hello />"

const renderedText = computed(() => {
  return {
    name: "DynamicComponent",
    template: dynamicallyGeneratedText,
    components: { NHello },
  }
})
</script>
