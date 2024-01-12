<template>
  <div class="view-page">
    <div class="content-view">
    <PageHeader :pageName="'Account Information'" />
    <h1>OK</h1>
    <div>
      <h2>User Information</h2>
      <p><strong>Full Name:</strong> {{ user.fullname }}</p>
      <!-- <p><strong>Avatar:</strong> <img :src="user.avatar" alt="User Avatar"></p> -->
      <p><strong>Birth Date:</strong> {{ user.birth }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
    </div>
  </div>
  </div>
  
</template>

<script setup lang="ts">
  import PageHeader from '@/components/PageHeader.vue';
  interface User {
    fullname: string,
    avatar: string,
    birth: string,
    phone: string,
  }

  const user: User = {
    fullname: 'John Doe',
    avatar: 'path/to/avatar.jpg',
    birth: '1990-01-01',
    phone: '+1234567890',
};

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
      background-color: $bgCo3;
      border-top-left-radius: 15px;
      height: calc(100vh - $header-height);
      padding: 3%;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      // align-items: center;
      h1{
        padding: 50px;
        color: rgb(0, 0, 0);
      }
      h2{
        padding: 50px;
        color: rgb(0, 0, 0);
      }
    }
  }
</style>