<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import Login from './components/Login.vue';
import { RouterView } from 'vue-router'
import { provide,ref,toRefs } from 'vue';
import { defineAsyncComponent } from 'vue';
import api from '@/api/index'; 
  
  const loggedIn = ref(false);
  const fullname = ref("");
  // const 
  function login(){
    loggedIn.value=true
  }
  function logout(){
    fullname.value="";
    loggedIn.value=false
  }
  function setFullname(thefullname:string) {
    fullname.value=thefullname
  }
  provide('loggedIn', loggedIn);
  provide('login', login);
  provide('setFullname', setFullname);
  provide('fullname', fullname);
  provide('logout', logout);
</script>

<template>
  <AppHeader/>
  <RouterView />
</template>