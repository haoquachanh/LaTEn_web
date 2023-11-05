<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { RouterView } from 'vue-router'
import { provide,ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import api from '@/api/index'; 

const loggedIn = ref(false);
const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    if (response.data.success) {
      loggedIn.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

provide('api', api);
provide('loggedIn', loggedIn);
provide('login', login);

provide('api', api); 
</script>

<template>
  <AppHeader/>
  <RouterView />
</template>