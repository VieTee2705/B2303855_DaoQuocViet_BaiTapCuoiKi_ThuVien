<script setup>
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
  <div id="app">
    <AppHeader />

    <main>
        <router-view />
    </main>

    </div>
</template>

<style>
/* Style chung cho toàn App */
#app {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa; /* Màu nền xám nhẹ cho toàn trang */
  min-height: 100vh;
}
</style>