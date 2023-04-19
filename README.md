Bug reproduction in Nuxt v3.4.1:

1. Run `npm install`
1. Run `npx nuxi build`
2. It will build correctly
3. Run `npx nuxi start`
4. It will start the server
5. Navigate to `http://localhost:3000/guide/test/aa`

OUTCOME: 500
```
ReferenceError: Cannot access '__nuxt_component_0' before initialization
    at file:///.../nuxt3test/.output/server/chunks/_...guideId_-70185f63.mjs:661:11
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
```

DESIRED OUTCOME: 200, with following content
```
This is a template { "gameId": "test", "guideId": [ "aa" ] }
Hello world! front page
```

PROBLEM:
The "Hello world" text is coming from the `NHintBody.vue` component that is a dynamic component that will generate a dynamic template including other components, in this case `NHello`.
To make it not complain about the hydration problems and not make the "Hello world" text disappear on client-side, I had to add the `vite:extendedConfig` part into `nuxt.config.ts`. The "Hello world" text came from the ssr, still.

Even without the `vite:extendedConfig` part in nuxt.config.ts the error happens in built server. The problem lies in this code:
```NHintBody.vue
<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div data-nosnippet>
    <component :is="renderedText" />
  </div>
</template>

<script setup>
import * as components from "#components"

const dynamicallyGeneratedText = "Hello <n-hello />"

const renderedText = computed(() => {
  return {
    name: "DynamicComponent",
    template: dynamicallyGeneratedText,
    components,
  }
})
</script>
```

I think the `import * as component from "#components"` is generated in incorrect position in the final chunk for the page (`.output/server/chunks/_...guideId_-something.mjs`)

If I import only NHello like this `import { NHello } from "#components"` and use it on the DynamicComponent components `components: { NHello }` it works as it is not generating the components const in the chunk at all. But I would like to have access to all the components inside my dynamic component. And it works on `npx nuxi dev`.