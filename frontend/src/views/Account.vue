<template>
  <Login/>
</template>

<script setup lang="ts">
 import Login from "../components/Login.vue"
</script>

<style scoped lang="scss">
  @import '@/assets/_variables.scss';
  .view-page{
    position:fixed;
    height: 100vh-$header-height;
    width: 94%-$header-width;
    left: $header-width;
    top: $header-height;
    padding: 3%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .search-container {
    display: flex;
    align-items: center;
    width: 50%;
    background-color: #f2f2f2;
    border-radius: 20px;
    padding: 3px;
      .search-input {
        border: none;
        outline: none;
        padding: 15px;
        border-radius: 20px 0 0 20px;
        background-color: #f2f2f2;
        width: 90%;
      }

      .search-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 20px 15px;
        width: 9.5%;
        border-radius: 0 17px 17px 0;
        cursor: pointer;

        i {
          font-size: 18px;
        }
      }
    }
    .result-dict-search {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-top: 15px;
      div{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: flex-end;
        h1{font-size: 36px; border-radius: 30%;}
        button{
          border: none;
          height: 30px;
          margin: 0;
          padding: 10px 20px;
          width: auto;
          background-color: #4CAF50;
          border-radius: 5px;
          margin-bottom: 5px;
          font-weight: bolder;
          
        }:hover{
          background-color: #38923b;
          color: #f2f2f2;
        }
      }
      hr{width:100%; size: 2px;}
      h2{font-size: 30px;}
      h3{font-size:25px}
    }
    
  }
</style>
