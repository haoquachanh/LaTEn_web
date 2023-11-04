<script setup lang="ts">
import Navigation from './Navigation.vue';
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="wrapper">
    <div class="logo_app">
      <img src="../../src/assets/logo.svg" alt="logo"/>
      <h1>JaquaSchao</h1>
    </div>
    <Navigation/>
    <RouterLink to="/account" class="accountbtn">Account</RouterLink>
    <button class="headerbtn"> Collapse </button>
  </div>
</template>

<style lang="scss" scoped>
  // Định nghĩa biến
  @import '@/assets/_variables.scss';
  $background-color: #f4f4f4; // Màu nền cho header
  .wrapper {
    position: fixed;  
    left:0;
    top:0;
    height: 100vh;
    width: $header-width;
    display: flex;
    background-color: $background-color;
    padding: 12px 5% 5% 5%;
    flex-direction: column;
    align-items: center;
    .logo_app{
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      height: 100px;
      img{
        height: 70px;
        width: 70px;
      }
      h1 {
        // width: 100%;
        font-size: 28px;
        padding: 10px 0;
        color: green;
        align-items: center;
        
      }
    }
    .accountbtn{
      position: absolute;
      bottom: 8%;
      align-items: center;
      justify-content: center;
      padding: 10px 60px;
      font-size: 20px;
      font-weight:600;
      text-decoration: none;
      color: #333;
      border-radius: 10px;
    }
    button{
      position: absolute;
      bottom: 2%;
      padding: 5px;
    }
  }
  
</style>