<template>
  <button @click="openLogout" class="theopen">Logout</button>
  <div class="popup-container" v-if="showPopup"   @keydown.esc="closeLogout" >
    <div class="popup"  ref="popupContent" @click="clickOutside">
      <h2>Do you want to log out?</h2> <hr>
      <div class="logoutform">
        <button @click="closeLogout()" class="logoutbtnN">No</button>
        <button @click="logout();" class="logoutbtnY">Yes</button>
      </div>
      <!-- <hr />
      <button @click="" class="register">Register</button> -->
      <p>Click outside / Press ESC   to close Logout</p>

    </div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();
  const showPopup = ref(false);

  const openLogout=(event)=>{
    event.stopPropagation();
    showPopup.value = true;
  };

  const closeLogout = () => {
    showPopup.value = false;
  };

  const clickOutside = (event) => {
    if (!event.target.closest(".popup")) {
      closeLogout();
    }
  };

  const logout = async () => {
    try {
      await store.dispatch('logout');
      closeLogout();
    } catch (error) {
      closeLogout();
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLogin();
      }
    });
    document.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLogin();
      }
    });
    document.removeEventListener('click', clickOutside);
  });
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
.theopen{
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
    background-color:rgb(199, 236, 228);
    cursor: pointer;
  }
}
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(39, 202, 118, 0.3);    
  z-index: 999 !important;

  .popup {
    z-index: 999;
    background-color: #fff;
    padding: 80px 50px;
    border-radius: 10px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;
    h2{
      font-size: 39px;
      color: #000;
      padding: 0;
    }
    hr{
      width: 80%;
      margin: 0;
    }
    .logoutform{
      width: 100%;
      padding: 20px 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      input{
        width: 100%;
        font-size: 26px;
        margin: 20px;
      }
      button {
        margin: 20px 0;
        width: 30%;
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        font-size: 22px;
        border-radius: 15px;
        border: 3px solid rgb(16, 136, 44);
        &:hover{
          cursor: pointer;
          background-color:rgb(16, 85, 16);
        }
      }
      .logoutbtnY{
        background-color: #e91b1b;
        border: 3px solid red;
        &:hover{
          background-color: #9a1919;
        }
      }
      
    }
    input {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    p{
      color: rgba(82, 180, 204, 0.568);
      font-style: italic;
    }
  }
}
</style>@/store/index-old