<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import Login from '@/components/Login.vue';
</script>

<template>
  <h1>Game and game :)) </h1>
  
  <h2>{{
    // @ts-ignore
    $store.state.count}}</h2>
    
</template>

<style lang="scss" scoped>
  h1{
    color: #7b0c0c;
  }
</style>