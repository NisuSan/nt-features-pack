<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div style="height: calc(100vh - 6.5rem);" id="themes-panel" class="grid grid-cols-10 gap-4 px-4">
      <n-card class="col-span-3 shadow-md" :title="editingTheme ? `Editing the ${capitalize(editingTheme)} theme` : 'List of the themes'">
        <div v-for="(colors, theme) in filteredThemes" :key="theme">
          <span class="flex justify-between mb-1 mx-3 font-semibold">
            <span>{{ capitalize(theme) }}</span>
            <span>
              <span :class="editingTheme === theme ? `text-${themeName}-warning hover:text-${themeName}-warning-hover` : `text-${themeName}-text hover:text-${themeName}-main-brand`" class="cursor-pointer" @click="editTheme(theme)">{{ editingTheme === theme ? 'In edit' : 'Edit' }}</span>
              <n-divider vertical />
              <span :class="theme === themeName ? `text-${themeName}-main-brand hover:text-${themeName}-main-brand-hover` : `text-${themeName}-text hover:text-${themeName}-main-brand`" class="cursor-pointer" @click="setTheme(theme)">{{ theme === themeName ? 'Active' : 'Activate' }}</span>
            </span>
            </span>
          <div :class="`flex flex-row max-w-full mx-2 mb-4 border border-${themeName}-border rounded p-3 `">
            <n-scrollbar content-class="flex items-center" x-scrollable trigger="none">
              <div class="flex flex-col justify-center items-center mb-4" v-for="(c, index) in baseColors" :key="index">
                <div :style="{ 'background-color': colors[`${theme}${c}`] }" :class="`flex justify-center items-center w-20 h-16 rounded-md shadow-harder mx-3`"></div>
                <span class="inline-block mt-1">{{ c.slice(1) }}</span>
              </div>
            </n-scrollbar>
          </div>
        </div>
        <n-float-button position="absolute" right="14px" bottom="14px" type="primary" @click="createTheme()">
          <span style="font-size: 21px; font-weight: 600; position: relative; top: -1px;">+</span>
        </n-float-button>
      </n-card>
      <n-card class="col-span-7 shadow-md" title="Preview">
        <n-tabs class="card-tabs" default-value="elements" size="medium" animated>
          <n-tab-pane name="elements" tab="UI Elements">

          </n-tab-pane>
          <n-tab-pane name="code" tab="Theme colors">

          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from '#imports'
  import { useTheme } from '../composables'
  import { api } from '../composables/apiComposables'
  import { useAppColors } from '../composables/generableComposables'
  import { capitalize } from '../utils/pure'

  const { themeName, setTheme } = useTheme()
  const appColors = useAppColors()
  const baseColors = [
    '-background',
    '-text',
    '-main-brand',
    '-success',
    '-danger',
    '-warning',
  ]
  const editingTheme = ref('')

  const existingThemes = reactive<Record<string, Record<string, string>>>({})
  Object.entries(appColors).forEach(([key, value]) => (existingThemes[key.split('-')[0]] ??= {})[key] = value)

  const filteredThemes = computed(() => Object.fromEntries(Object.entries(existingThemes).filter(([k]) => k === (editingTheme.value ? editingTheme.value : k))))

  function createTheme() {
    const newTheme = `new${Object.keys(existingThemes).length}`
    existingThemes[newTheme] = Object.assign({}, Object.fromEntries(Object.entries(existingThemes[Object.keys(existingThemes)[0]]).map(([k, v]) => [`${newTheme}-` + k.split('-').slice(1).join('-'), v])))
  }

  function editTheme(theme: string) {
    editingTheme.value = theme
  }

</script>

<style scoped lang="scss">

</style>
