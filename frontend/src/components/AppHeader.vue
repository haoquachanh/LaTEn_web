<script setup lang="ts">
import Navigation from './Navigation.vue';
import Login from './Login.vue';
import { RouterLink } from 'vue-router'
import { ref } from 'vue';

const loggedIn = ref(false);
const popupRef = ref<typeof Login | null>(null);
const openLogin = () => {
  if (popupRef.value) {
    popupRef.value.openPopup();
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="logo_app">
      <img src="../../src/assets/logo.svg" alt="logo"/>
      <h1>JaquaSchao</h1>
    </div>
    <Navigation/>
    <template v-if="loggedIn">
      <RouterLink to="/account" class="accountbtn">Account</RouterLink>
    </template>
    <template v-else >
      <div class="btnaccLR">
        <button @click="openLogin" class="accountbtnLR">Login</button>
        <button @click="" class="accountbtnLR">Register</button>
      </div>
    </template>
    <button class="headerbtn" @click=""> Collapse </button>
    <Login ref="popupRef" />
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
    z-index: 9999;
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
    button{
      position: absolute;
      bottom: 2%;
      padding: 5px;
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

    div.btnaccLR{
      position: absolute;
      width: 100%;
      height: 18%;
      bottom: 8%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      // padding: 70px;
      .accountbtnLR{
        position: relative;
        width: 200px;
        height: 30%;
        padding: 10px 30px;
        font-size: 18px;
        font-weight:600;
        text-decoration: none;
        color: #333;
        border: none;
        background-color: transparent;
        border-radius: 10px;
        &:hover{
          background-color: rgb(111, 223, 223);
        }
      }
    }
    
  }
  
</style>