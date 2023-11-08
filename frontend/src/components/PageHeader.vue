<script setup lang="ts">
  import { ref , onMounted} from 'vue';
  export interface MyObject {
    display: string;
    button: boolean;
    path: string;
    function?: string;
  }
  
  const selected = ref(-1);
  const handleClick = (index: number) => {
    selected.value = index;
  };

  const { pageName, buttonArr } = defineProps({
    pageName: String,
    buttonArr: {
      type: Object as () => MyObject[],
      // required: true,
    },
  }); 
  onMounted(() => {
    if (buttonArr && buttonArr.length > 0) {
      selected.value = 0; // Set the first button as active by default
    }
  });
  
</script>

<template>
  <div class="wrapper">
      <h1>> {{ pageName }}</h1>
      <div v-if="buttonArr && buttonArr[0].button" class="btnfts">
          <button v-for="(item, index) in buttonArr" :key="index" @click="handleClick(index)" :class="{ 'btn': true, 'active': selected === index }">
          {{ item.display }}
          </button>
      </div>
      <div v-else>
          <RouterLink :to="item.path" v-for="(item, index) in buttonArr" :key="index" @click="">
              {{ item.display }}
          </RouterLink>
      </div>
  </div>
</template>



<style lang="scss" scoped>
  // Định nghĩa biến
  @import '@/assets/_variables.scss';
  .wrapper {
    z-index: 10!important;
    position: fixed;  
    left:$header-width;
    top:0;
    height: $header-height;
    width:  calc(100vw - $header-width);
    display: flex;
    background-color: $bgCo1;
    padding: 10px;
    flex-direction: column;
    align-items:start;
      
    h1 {
    // width: 100%;
    font-size: 28px;
    padding: 10px 0;
    color: green;
    }
    .btnfts{
      z-index: 10;
      padding: 20px;
      display: flex;
      width: 80%;
      justify-content: center;
      margin-left: 5%;
      .btn {
        background-color: rgb(52, 171, 52);
        margin-left: 5%;
        padding: 15px 5px;
        flex-grow: 1;
        flex-basis: 0;
        color: white;
        border: none;
        border-radius: 8px;
        
      }:hover{
          cursor: pointer;
          scale: 1.01;
        }
      .btn.active {
        font-weight: bold;
        background-color: rgb(25, 84, 15);
      }
  
    }
  }
  
</style>