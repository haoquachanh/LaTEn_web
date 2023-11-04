<template>
  <div class="view-page">
    <PageHeader :pageName="'Dictionary'" :buttonArr="theObjectDictionary"></PageHeader>

    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="E n t e r   s o m e   w o r d s   h e r e . . ."
      />
      <button class="search-button">
        <i class="fa fa-search"></i>
      </button>
    </div>
    <div class="result-dict-search">
      <div><h1> Sea{{ keySearch }} </h1>
      <button>Add to MyFavorite</button></div>
      <hr>
      <h2>Biển{{ result }}</h2>
      <h3>Các từ gần nghĩa, đồng nghĩa: </h3>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
interface MyObject {
  display: string;
  button: boolean;
  path: string;
  function?: string;
}

let theObjectDictionary:MyObject[]=[
  {display:"English To English", button: true, path:"/"},
  {display:"English To Vietnamese", button: true,path:"/"},
  // {display:"English To China", button: true,path:"/ko"}
]

let result:String
let keySearch:String


let searchQuery = '';
const handleSearch = () => {
  console.log('Perform search operation for:', searchQuery);
};

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
