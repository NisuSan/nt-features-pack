<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div style="height: calc(100vh - 6.5rem);" id="themes-panel" class="grid grid-cols-10 gap-4 px-4">
      <n-card class="col-span-3 shadow-md" title="List of the themes">
        <div class="flex flex-col items-center w-full mx-2 my-4 border rounded p-2">
          <div class="flex justify-center items-center w-20 h-20 rounded shadow-harder bg-slate-500">

          </div>
        </div>
      </n-card>
      <n-card class="col-span-7 shadow-md" title="Preview">
        <!-- Content for 70% width -->
      </n-card>
    </div>
  </div>
</template>

<script settup lang="ts">
  import { api } from '../composables/apiComposables'

  const { data: existingThemes } = await api().theme.getData()

</script>
