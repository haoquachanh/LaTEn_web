<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import { RouterView } from 'vue-router'
import { mapGetters, mapActions } from 'vuex';
import { provide, ref } from 'vue';

// const { getUser } = mapGetters(['getUser'])
const { login, logout } = mapActions(['login', 'logout'])
// const theUser = JSON.parse(user)
const loggedIn = ref(false);
// if (user) loggedIn.value=true

provide('loggedIn', loggedIn);
provide('login', login);
provide('logout', logout);
// provide('getUser', getUser);
</script>

<template>
  <RouterView />
  <AppHeader/>
</template>
