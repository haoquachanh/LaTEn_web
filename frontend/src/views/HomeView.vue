<script setup lang="ts">
</script>

<template>
  <div class="view-page">
    <div class="content-view">
    <h1>Welcome to LaTEn Website!</h1>
    <hr/>
    <h2>Now, just say "Welcome!"</h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import '@/assets/_variables.scss';
  .view-page{
    background-color: $bgCo1;
    position:fixed;
    height: 100vh;
    width: 100%-$header-width;
    left: $header-width;
    top: 0;
    .content-view{
      position: relative;
      background-color: $bgCo3;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      height: 100vh;
      padding: 3%;
      display: flex;
      // justify-content: center;
      flex-direction: column;
      align-items: center;
      h1{
        padding-top: 50px;
        color: black;
        font-size: 50px;
        font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-style: italic;
        text-decoration: solid 1px black;
      }
      hr{
        width: 50%;
        size: 4px;
        color: rgb(0, 255, 255);
      }
      h2{
        margin-top: 100px;
      }
    }
  }
</style>