<template>
  <div class="view-page">
    <div class="content-view">
    <PageHeader :pageName="'Account Information'" />
    <h1></h1>
    <h2>{{ token }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue';
  import PageHeader from '@/components/PageHeader.vue';
  // import jwt from 'jsonwebtoken';
  // const fullname = inject('fullname',"Your Name");
  const token = localStorage?.getItem('token') || "";

</script>

<style scoped lang="scss">
  @import '@/assets/_variables.scss';
  .view-page{
    background-color: $bgCo1;
    position:fixed;
    height: 100vh-$header-height;
    width: 100%-$header-width;
    left: $header-width;
    top: $header-height;
    .content-view{
      position: relative;
      background-color: $bgCo2;
      border-top-left-radius: 15px;
      height: calc(100vh - $header-height);
      padding: 3%;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      // align-items: center;
      h1{
        padding: 50px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
