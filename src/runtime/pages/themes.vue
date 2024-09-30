<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex justify-center items-center font-semibold text-4xl mt-5 mb-7">Theme Genarator</div>
    <div id="colors-panel" class="w-full flex justify-center items-center">
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center w-[7.8125rem] h-[7.8125rem] rounded shadow-harder bg-slate-500"></div>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script settup lang="ts">
  import { api } from '../composables/apiComposables'

  console.log(await api().theme.getIndex())

</script>
