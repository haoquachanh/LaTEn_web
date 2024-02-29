<template>
  <button @click="openRegister" class="theopen">Register</button>
  <div class="popup-container" v-if="showPopup" @keydown.esc="closeRegister">
    <div class="popup" ref="popupContent" @click="clickOutside">
      <h2>Register</h2> <hr />
      <div class="registerform">
        
        <label for="fullname">Fullname:</label>
        <input type="text" v-model="fullname" placeholder="Marty Byrde" id="fullname" />

        <label for="email">Email:</label>
        <input type="text" v-model="email" placeholder="example@gmail.com" id="email" />

        <label for="password">Password:</label>
        <input type="password" v-model="password" placeholder="******" id="password" />

        <label for="passwordConfirm">Confirm password:</label>
        <input type="password" v-model="passwordConfirm" placeholder="******" id="passwordConfirm" />

        <button @click="handleRegister(); closeRegister()" class="registerbtn">Register</button>
      </div>
      <p>Click outside / Press ESC to close Register</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useStore } from 'vuex';

  const store = useStore();
  const showPopup = ref(false);
  const fullname = ref('');
  const email = ref('');
  const password = ref('');
  const passwordConfirm = ref('');

  const openRegister = () => {
    event.stopPropagation();
    showPopup.value = true;
  };

  const closeRegister = () => {
    showPopup.value = false;
  };

  const clickOutside = (event) => {
    if (!event.target.closest(".popup")) {
      closeRegister();
    }
  };

  const handleRegister = async () => {
    try {
      // Check if password matches confirmation
      if (password.value !== passwordConfirm.value) {
        console.error('Password and Confirm password do not match');
        return;
      }
      await store.dispatch('register', { email: email.value, password: password.value, fullname: fullname.value });
      closeRegister();
    } catch (error) {
      console.error('Register failed', error);
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeRegister();
      }
    });
    document.addEventListener('click', clickOutside);
    onBeforeUnmount(() => {
      document.removeEventListener('click', clickOutside);
    });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeRegister();
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
    justify-content: space-between;
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
    .registerform{
      width: 100%;
      height: 70%;
      display: flex;
      padding: 15px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      label{
        margin-left: 20%;
        margin-top: 7px;
        align-self: start;
        color: #000;
        font-size: 16px;
        font-style: italic;
        font-weight: 500;

      }
      
      input{
        width: 60%;
        font-size: 16px;
        margin: 0 20px;
      }
      .registerbtn {
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
      margin: 0px 0;
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
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    p{
      height: 10%;
      padding-top: 5%;
      color: rgba(82, 180, 204, 0.568);
      font-style: italic;
      margin-bottom: 5px;
    }
  }
}
</style>@/store/index-old