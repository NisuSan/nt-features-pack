<template>
  <n-config-provider :theme-overrides="themeUI">
    <n-dialog-provider>
      <NuxtPage />
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  const { themeUI } = useTheme()
</script>
