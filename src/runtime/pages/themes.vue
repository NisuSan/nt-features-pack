<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div style="height: calc(100vh - 6.5rem);" id="themes-panel" class="grid grid-cols-10 gap-4 px-4">
      <n-card class="col-span-3 shadow-md">
        <template #header>
          <span v-if="editingTheme" class="font-semibold">Editing the <span :class="`text-warning`">{{ capitalize(editingTheme) }}</span> theme</span>
          <span v-else class="font-semibold">Available Themes</span>
        </template>
        <div v-for="(colors, theme) in filteredThemes" :key="theme">
          <span class="flex justify-between mb-1 mx-3 font-semibold">
            <span>{{ capitalize(theme as string) }}</span>
            <span>
              <span v-if="theme === themeName" :class="editingTheme === theme ? `text-warning hover:text-warning-hover` : `text-text hover:text-main-brand`" class="cursor-pointer" @click="editTheme(theme as string)">{{ editingTheme === theme ? 'In edit' : 'Edit' }}</span>
              <n-divider v-if="theme === themeName" vertical />
              <span :class="theme === themeName ? `text-main-brand hover:text-main-brand-hover` : `text-text hover:text-main-brand`" class="cursor-pointer" @click="setTheme(theme as string)">{{ theme === themeName ? 'Active' : 'Activate' }}</span>
            </span>
            </span>
          <div :class="`flex flex-row max-w-full mx-2 mb-4 border border-border rounded p-3 `">
            <n-scrollbar content-class="flex items-center" x-scrollable trigger="none">
              <div class="flex flex-col justify-center items-center mb-4" v-for="(c, index) in baseColors" :key="index">
                <div :style="{'background-color': colors[c] }" :class="`flex justify-center items-center w-20 h-16 rounded-md shadow-harder mx-3`"></div>
                <span class="inline-block mt-1">{{ c }}</span>
              </div>
            </n-scrollbar>
          </div>
        </div>
        <div v-if="editingTheme">
           <c-input v-model.number="testInput.aa" type="text" validation="text" />
        </div>
        <n-float-button v-if="editingTheme" position="absolute" left="14px" bottom="14px" type="primary" @click="declineThemeEditing()">
          <span class="icon-[pepicons-pop--arrow-spin]"></span>
        </n-float-button>
        <n-float-button v-if="!editingTheme" position="absolute" right="14px" bottom="14px" type="primary" @click="createTheme()">
          <span class="icon-[pepicons-pop--plus]"></span>
        </n-float-button>
        <n-float-button v-else position="absolute" right="14px" bottom="14px" type="primary" @click="saveThemeEditing()">
          <span class="icon-[pepicons-pop--floppy-disk]"></span>
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
  import { useDialog } from 'naive-ui'
  import { useTheme } from '../composables'
  import { api } from '../composables/apiComposables'
  import { useAppColors, type AppColors } from '../composables/generableComposables'
  import { capitalize } from '../utils/pure'
  import CInput from '../components/CInput.vue'

  const dialog = useDialog()
  const { themeName, setTheme } = useTheme()
  const existingThemes = reactive(Object.fromEntries(Object.entries(useAppColors()).filter(([k]) => k !== 'currentColors')))
  const baseColors = [ 'background', 'text', 'main-brand', 'success', 'danger', 'warning', ]
  const editingTheme = ref('')
  const bcTheme = reactive({})
  const testInput = reactive({ aa: 18 })
  const filteredThemes = computed(() => Object.fromEntries(Object.entries(existingThemes).filter(([k]) => k === (editingTheme.value || k))))

  function createTheme() {
    const newTheme = `new${Object.keys(existingThemes).length}`
    existingThemes[newTheme] = Object.assign({}, existingThemes['light'])
  }

  function editTheme(theme: string) {
    editingTheme.value = theme
    Object.assign(bcTheme, { ...existingThemes[theme] })
  }

  function declineThemeEditing() {
    dialog.warning({
      title: 'Confirm',
      content: 'Are you sure?',
      positiveText: 'Sure',
      negativeText: 'Not Sure',
      onPositiveClick: () => {
        existingThemes[editingTheme.value] = bcTheme as AppColors
        Object.assign(bcTheme, {})
        editingTheme.value = ''
      }
    })
  }

  function saveThemeEditing() {
    editingTheme.value = ''
  }

</script>

<style scoped lang="scss">

</style>
