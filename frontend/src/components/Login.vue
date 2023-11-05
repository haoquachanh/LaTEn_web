<template>
  <div class="popup-container" v-if="showPopup">
    <div class="popup">
      <h2>Login</h2> <hr>
      <form @submit.prevent="handleLogin" class="loginform">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button type="submit" class="loginbtn">Login</button>
      </form>
      <hr />
      <button @click="" class="register">Register</button>
      <p>Click outside to close Login</p>
      <button @click="closePopup" class="closepopup">X</button>

    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        showPopup: false,
        username: '',
        password: '',
      };
    },
    methods: {
      openPopup() {
        this.showPopup = true;
      },
      closePopup() {
        this.showPopup = false;
      },
      handleLogin() {
        // Handle login logic here
        console.log('Logging in with:', this.username, this.password);
        this.closePopup();
      },
    },
  };
  </script>

  <style lang="scss">
  @import '@/assets/_variables.scss';
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
      padding: 50px;
      border-radius: 10px;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h2{
        font-size: 39px;
        color: #000;
      }
      hr{
        width: 80%;
      }
      .loginform{
      z-index: 999;

        padding: 20px 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        input{
          width: 100%;
          font-size: 26px;
          margin: 10px;
        }
        .loginbtn {
          margin: 20px 0;
          width: 80%;
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          font-size: 22px;
          border-radius: 15px;
          border: 3px solid rgb(16, 136, 44);
          &:hover{
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
  </style>
  