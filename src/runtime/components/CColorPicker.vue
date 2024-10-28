<template>
  <div class="flex items-center mb-5 last:mb-0">
    <div :style="{ 'background-color': model, 'border': `2.5px solid ${ nearColor }` }" class="block w-10 h-8 rounded cursor-pointer" ref="elTarget" @click="show = true"></div>
    <span class="inline-block ml-2">{{ props.name }}</span>
    <Vue3ColorPicker v-if="show" v-model="model" type="HEX" mode="solid" input-type="RGB" :show-color-list="false" :show-picker-mode="false" :style="pickerPositionStyle" class="absolute" ref="elPicker" @vue:mounted="onPickerMounted()"/>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
  import '@cyhnkckali/vue3-color-picker/dist/style.css'
  import { onClickOutside } from '@vueuse/core/index.mjs'
  import { useAppColors } from '../composables/generableComposables'
  import { deltaE } from '../utils/pure'

  const model = defineModel<string>({ required: true })
  const props = withDefaults(defineProps<{
    name: string,
    useDiff?: boolean,
  }>(), {
    useDiff: true
  })

  const elTarget = ref<HTMLImageElement | null>(null)
  const elPicker = ref<HTMLImageElement | null>(null)

  const appColors = useAppColors()
  const nearColor = computed(() => props.useDiff && deltaE(appColors.currentColors.value['card-background'], model.value) < 20 ? appColors.currentColors.value['card-text'] : 'transparent')
  const show = ref(false)
  const pickerPositionStyle = reactive({
    left: 'inherit',
    top: 'inherit',
  })

  function onPickerMounted() {
    onClickOutside(elPicker, () => show.value = false)
    //@ts-expect-error
    const pickerRect = elPicker.value.$el.getBoundingClientRect() as DOMRect | undefined
    const targetRect = elTarget.value?.getBoundingClientRect()

    pickerPositionStyle.left = (targetRect?.width || 0) + 30 + 'px'
    pickerPositionStyle.top = ((targetRect?.y || 0) > (pickerRect?.height || 0)
      ? (targetRect?.y || 0) - (pickerRect?.height || 0)
      : (targetRect?.y || 0) + (pickerRect?.height || 0)) + 'px'

  }
</script>

<style lang="scss">
</style>
