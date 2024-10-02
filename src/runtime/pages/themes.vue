<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div style="height: calc(100vh - 6.5rem);" id="themes-panel" class="grid grid-cols-10 gap-4 px-4">
      <n-card class="col-span-3 shadow-md" title="List of the themes">
        <div v-for="(colors, theme) in existingThemes">
          <span class="inline-block mb-1 ml-2 font-semibold">{{ capitalize(theme) }}</span>
            <div :class="`flex flex-row max-w-full mx-2 mb-4 border border-${themeName}-border rounded p-3 `">
              <div class="flex flex-col justify-center items-center" v-for="(c, index) in baseColors" :key="index">
                <div :class="`flex justify-center items-center w-20 h-16 rounded-md shadow-harder mx-3 bg-${theme}${c}`"></div>
                <span class="inline-block mt-1">{{ c.slice(1) }}</span>
              </div>
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
  import { computed, reactive } from '#imports'
  import { useTheme } from '../composables'
  import { api } from '../composables/apiComposables'
  import { useAppColors } from '../composables/generableComposables'
  import { capitalize } from '../utils/pure'

  const { themeName } = useTheme()
  const appColors = useAppColors()
  const baseColors = [
    '-background',
    '-text',
    '-main-brand',
    '-success',
    '-danger',
    '-warning',
  ]

  const existingThemes = reactive<Record<string, Record<string, string>>>({})
  Object.entries(appColors).forEach(([key, value]) => (existingThemes[key.split('-')[0]] ??= {})[key] = value)

</script>
