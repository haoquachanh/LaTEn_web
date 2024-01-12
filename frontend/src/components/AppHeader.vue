<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Navigation from './Navigation.vue';
import Login from './Login.vue';
import Logout from './Logout.vue';
import Register from './Register.vue';
import { useStore } from "vuex";
import { onMounted } from 'vue';
const store = useStore();
onMounted(() => {
  store.dispatch('checkLoginStatus');
});
const isLoggedIn = () => {
  return store.state.auth.loggedIn;
};


</script>

<template>
  <div class="wrapper">

    <div class="logo_app">
      <img src="../../src/assets/LaTEn.png" alt="logo"/>
      <!-- <h1>JaquaSchao</h1> -->
    </div>
    <Navigation />
    <template v-if="isLoggedIn()">
      <div class="btnaccLR">
        <Logout />
        <RouterLink to="/account" class="accountbtn">Account</RouterLink>
      </div>
    </template>
    <template v-else >
      <div class="btnaccLR">
        <Login />
        <Register />
        <!-- <button @click="" class="accountbtnLR">Login</button> -->
      </div>
    </template>
    <button class="headerbtn" @click=""> Collapse </button>
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
    flex-direction: column;
    align-items: center;
    padding-top: 15px;
    z-index: 9999;
    .logo_app{
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      height: 100px;
      width: 100%;
      img{
        height: 100px;
        width: 100px;
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
      width: 80%;
      bottom: 8%;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
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
      justify-content: space-around;
      flex-wrap: wrap;
      // padding: 70px;
      .accountbtnLR{
        position: relative;
        width: 80%;
        height: 32%;
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
          cursor: pointer;
        }
      }
    }
    
  }
  
</style>