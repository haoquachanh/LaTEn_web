<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/game">Game</RouterLink>
    <RouterLink to="/contact">Contact</RouterLink>
    <RouterLink to="/dictionary">Dictionary</RouterLink>
  </nav>
</template>

<style lang="scss" scoped>
  nav {
    
    width: 200px;
    display: flex;
    flex-direction: column;
    
    a {
      align-items: center;
      padding: 10px 10px 10px 50px;
      font-size: 20px;
      font-weight:600;
      text-decoration: none;
      color: #333;
      border-radius: 10px;
    }
  }
</style>
