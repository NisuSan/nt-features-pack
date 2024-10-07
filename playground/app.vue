<template>
  <n-config-provider :locale="ukUA" :date-locale="dateUkUA" :theme-overrides="themeUI">
    <n-dialog-provider>
      <NuxtPage />
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { ukUA, dateUkUA } from 'naive-ui'
  const { themeUI } = useTheme()
</script>
