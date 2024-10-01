<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div style="height: calc(100vh - 6.5rem);" id="themes-panel" class="grid grid-cols-10 gap-4 px-4">
      <n-card class="col-span-3 shadow-md" title="List of the themes">
        <div v-for="(colors, theme) in existingThemes">
          <span class="inline-block mb-1 ml-2 font-semibold">{{ capitalize(theme) }}</span>
          <div class="flex flex-col max-w-full mx-2 mb-4 border border-light-border rounded p-3">
            <div class="flex justify-center items-center w-20 h-20 rounded-md shadow-harder"></div>
          </div>
        </div>
      </n-card>
      <n-card class="col-span-7 shadow-md" title="Preview">
        <!-- Content for 70% width -->
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { api } from '../composables/apiComposables'
  import { capitalize } from '../utils/pure'

  const { data: existingThemes } = await api().theme.getData({}, { default: () => ({}) })

</script>
