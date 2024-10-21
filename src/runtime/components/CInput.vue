<template>
  <div :class="{'checkbox-center': props.type === 'checkbox'}">
    <span v-if="props.title && props.type !== 'checkbox'" class="font-medium inline-block mb-1">{{ props.title }}</span><br v-if="props.autosize && props.title"/>
    <n-input ref="element" :class="{'autosized': props.autosize}" v-if="props.type === 'text' || props.type === 'number'" :autosize="props.autosize" v-model:value="value" type="text" :placeholder="props.placeholder" :disabled="props.disabled" :status="validationStatus" @focus="onFocus" @blur="onBlur"/>
    <n-checkbox v-else-if="props.type === 'checkbox'" v-model:checked="checked" :disabled="props.disabled">{{ props.title }}</n-checkbox>
    <n-select :class="{'select-autosize': props.autosize}" v-else-if="props.type === 'dropdown'" v-model:value="value" :options="options" :disabled="props.disabled" :multiple="props.multiple"/>
    <!-- @vue-ignore -->
    <n-date-picker :class="{'select-autosize': props.autosize}" v-else-if="props.type === 'date'" v-model:formatted-value="value" value-format="yyyy-MM-dd" format="dd.MM.yyyy" type="date" :disabled="props.disabled"/>
    <!-- @vue-ignore -->
    <n-date-picker :class="{'select-autosize': props.autosize}" v-else-if="props.type === 'datetime'" v-model:formatted-value="value" value-format="yyyy-MM-dd HH:mm:ss" format="dd.MM.yyyy HH:mm:ss" type="datetime" :disabled="props.disabled"/>
  </div>
</template>

<script setup lang="ts">
  import Joi from 'joi'
  import { onMounted, ref, watch } from 'vue'
  import { useTippy } from 'vue-tippy'

  const props = withDefaults(defineProps<{
    title?: string,
    type?: 'text' | 'number' | 'checkbox' | 'dropdown' | 'date' | 'datetime',
    autosize?: boolean,
    disabled?: boolean,
    validation?: 'text' | 'text-cyrillic' | 'text-latin' | 'number' | 'number-positive' | Joi.Schema,
    required?: boolean,
    multiple?: boolean,
    placeholder?: string
  }>(), {
    type: 'text',
    validation: 'text',
    autosize: true,
    required: true
  })

  const element = ref()
  const validationStatus = ref<'success' | 'warning' | 'error' | undefined>(undefined)
  const isTouched = ref(false)

  const value = defineModel<string | string[] | number | number[]>({
    set(n: string | string[] | number | number[]) {
      return props.type === 'number' && !Number.isNaN(Number(n)) && n !== '' && n !== '-' ? Number(n) : n
    }
  })
  const checked = defineModel<boolean>('checked')
  const options = defineModel<{ label: string, value: string | number, disabled?: boolean }[]>('options')

  let tippy: any = undefined

  onMounted(() => { if(props.type === 'text' || props.type === 'number') {
    tippy = useTippy(element.value.inputElRef, { theme: 'error' })

    if(props.validation) {
      let schema: Joi.Schema | undefined = undefined

      if(props.validation === 'number') {
        schema = Joi.number()
      }
      else if(props.validation === 'number-positive') {
        schema = Joi.number().positive()
      }
      else if (props.validation === 'text') {
        schema = Joi.string().regex(/^[A-Za-z\u0400-\u04FF\s'"]+$/)
      }
      else if (props.validation === 'text-cyrillic') {
        schema = Joi.string().regex(/^[\u0400-\u04FF\s'"]+$/)
      }
      else if (props.validation === 'text-latin') {
        schema = Joi.string().regex(/^[A-Za-z]+$/)
      }
      else {
        schema = props.validation
      }
      if(props.required) schema = schema?.required()

      if(typeof props.validation !== 'object') {
        schema = schema.messages({
          'any.required': 'Це поле є обов\'язковим для заповнення',
          'string.pattern.base': props.validation === 'text-cyrillic' ? 'Це поле повинно міститити лише кириличні літери, пробіли та апостроф' : 'Це поле повинно містити лише літери, пробіли та апостроф',
          'number.base': 'Це поле повинно містити лише цифри',
          'number.positive': 'Це поле повинно містити лише позитивні числа',
        })
      }

      watch(value, n => {
        const result = schema?.validate(n)
        const error = result?.error?.message ?? ''
        console.log(error);

        if(error) {
          tippy.setContent(error)
          tippy.show()
          validationStatus.value = 'error'
        }
        else {
          tippy.setContent('')
          tippy.hide()
          validationStatus.value = undefined
        }
      })
    }
  }})

  const onFocus = () => isTouched.value = true
  const onBlur = () => isTouched.value = false
</script>

<style lang="scss">
  .autosized {
    min-width: 250px !important;
  }

  .select-autosize {
    width: 250px !important;
  }

  .checkbox-center {
    display: flex;
    align-items: center;
  }
</style>
