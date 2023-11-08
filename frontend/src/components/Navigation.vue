<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <div><RouterLink to="/">Home</RouterLink></div>
    <div><RouterLink to="/game">Game</RouterLink></div>
    <div><RouterLink to="/contact">Contact</RouterLink></div>
    <div><RouterLink to="/dictionary">Dictionary</RouterLink></div>
    <div><RouterLink to="/tips">Tips</RouterLink></div>
</template>

<style lang="scss" scoped>
  div{
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    a {
      width: 80%;
      bottom: 8%;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
      margin-top: 10px;
      font-size: 20px;
      font-weight:600;
      text-decoration: none;
      color: #333;
      border-radius: 10px;
      &:hover{
        background-color: rgb(199, 236, 228);;
      }
    }
  }
</style>
