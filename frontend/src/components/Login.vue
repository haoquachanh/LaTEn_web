<template>
  <button @click="openLogin" class="theopen">Login</button>
  <div class="popup-container" v-if="showPopup" @keydown.esc="closeLogin">
    <div class="popup" ref="popupContent" @click="clickOutside">
      <h2>Login</h2> <hr>
      <div class="loginform">
        <label for="email">Email:</label>
        <input type="text" v-model="email" placeholder="example" />
        <label for="password">Password:</label>
        <input type="password" v-model="password" placeholder="******" />
        <button @click="loginAction" class="loginbtn">Login</button>
      </div>
      <p>Click outside / Press ESC to close Login</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();
  const showPopup = ref(false);
  const email = ref('');
  const password = ref('');

  const openLogin = (event) => {
    event.stopPropagation();
    showPopup.value = true;
  };

  const closeLogin = () => {
    showPopup.value = false;
  };

  const clickOutside = (event) => {
    if (!event.target.closest(".popup")) {
      closeLogin();
    }
  };

  const loginAction = async () => {
    try {
      await store.dispatch('login', { email: email.value, password: password.value });
      // Đăng nhập thành công, bạn có thể thực hiện các hành động khác ở đây
      closeLogin();
    } catch (error) {
      // Xử lý khi đăng nhập thất bại
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
    height: 80%;
    width: 40%;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    h2{
      height: 10%;
      font-size: 39px;
      color: #000;
    }
    hr{
      width: 80%;
      margin: 10px 0 20px 0;
    }
    .loginform{
      height: 70%;
      width: 100%;
      display: flex;
      padding: 15px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      label{
        margin-left: 20%;
        margin-top: 20px;
        align-self: start;
        color: #000;
        font-size: 16px;
        font-style: italic;
        font-weight: 500;
      }
      input{
        width: 60%;
        font-size: 16px;
        margin: 10px 0 20px 0;
      }
      .loginbtn {
        margin: 25px 0;
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
      
    }
    .register{
      margin: 20px 0;
      width: 80%;
      background-color: #6e4cb7; /* Green */
      border: 3px solid rgb(115, 30, 136);
      color: white;
      padding: 15px 32px;
      text-align: center;
      font-size: 22px;
      border-radius: 15px;
      
      &:hover{
        background-color:rgb(77, 0, 128);
        cursor: pointer;
        }
    }

    input {
      margin-bottom: 20px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    p{
      height: 10%;
      padding-top: 5%;
      color: rgba(82, 180, 204, 0.568);
      font-style: italic;
    }
  }
}
</style>