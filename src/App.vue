<template>
  <div id="app">
    <div id='left'>
        <img v-if="place == 'welcome'" src="./assets/LogoOrfit.png" id='logo' alt="logo">
        <amplify-authenticator>
          <div id='menu'>
            <p id='todayIs'>Welcome to Orfit! Today is...</p>
            <h1 id='date'>{{date}}</h1>
            <div id='menuOptions'>
              <p id='what'>What are we gonna do today?</p>
              <button v-if="!buttonOneState" v-on:click="triggerMenu(1)" class='option'>Today's Tasks</button> 
              <button v-else class='option selected'>Today's Tasks</button> 
              <br>
              <button v-if="!buttonTwoState" v-on:click="triggerMenu(2)" class='option'>Add Task</button> 
              <button v-else class='option selected' id='last'>Add Task</button>
              <amplify-sign-out></amplify-sign-out>
              <p id='logged'>Logged in as {{mail}}</p>
            </div>
          </div>
        </amplify-authenticator>
    </div>

    <div id='right'>
        <welcome v-if="place == 'welcome'"></welcome>
        <img v-else src='./assets/tasks.png' id='appImage'> 
        <addTask :user="mail" v-if="place =='addTask'"></addTask>
        <tasks :date="date" :user="mail" v-if="place=='tasks'"></tasks>
    </div>
  </div>
</template>
  

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import welcome from "./components/Welcome";
import addTask from "./components/AddTask";
import tasks from "./components/Tasks";



export default {
  name: 'App',
  components: {
    welcome,
    addTask,
    tasks
  },
  methods: {
    triggerMenu(btn){
      switch(btn){
        case 1:
          this.buttonOneState = true;
          this.buttonTwoState = false;
           this.place = "tasks";
        break;
        case 2:
          this.buttonOneState = false;
          this.buttonTwoState = true;
          this.place = "addTask";
        break;
      }
    }
  },
  data: function(){
    return {
      place: "welcome",
      loggedIn: false,
      user: undefined,
      authState: undefined,
      mail: undefined,
      date: "",
      buttonOneState: false,
      buttonTwoState: false
    }
  },
  created() {
    let today = new Date();
    let dd = String(today.getDate())
    let mm = String(today.getMonth() + 1)
    let yyyy = today.getFullYear();
    this.date = `${dd}/${mm}/${yyyy}`;
    onAuthUIStateChange((authState, authData) => {   
      this.authState = authState;
      if(authData){
        this.user = authData;
        this.mail = authData.attributes.email
      }
      if((authState == "signedin")||(authState == "signin")){
        this.place = "app"
      }else if(authState == "signedout"){
        this.place = "welcome"
      }
    });
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>


<style>
#logo{
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  text-align: center;
  margin: 0 auto;
  left: 45%;
  margin-top: 15%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
#left{
  background: #213F9B;
  display: grid;
  align-items: center;
  position: fixed;
  left: 0;
  width: 50vw;
  height: 100vh;
  z-index: 100;
}
#right{
  right: 0;
  width: 50%;
  height: 100vh;
  float: right;
}
#amplify-sign-out{
  background: #000!important;
}
#date{
  color: #8DEBFF;
  font-size: 96px;
  font-weight: bold;
  margin-top: 0;
}
#menu{
  min-height: 100vh;
}
#todayIs{
  color: white;
  font-size: 26px;
  margin: 0;
  margin-top: 80px;
}
#menuOptions{
  padding: 0% 10%;
}
#menuOptions > #what {
  color: white;
  text-align: left;
  font-size: 36px;
  font-weight: bold;
}
.option{
  width: 100%;
  height: 130px;
  color: white;
  border: none;
  margin-bottom: 40px;
  text-align: left;
  font-weight: bold;
  padding: 15px;
  padding-left: 40px;
  font-size: 72px;
  opacity: 0.5;
  transition: 0.5s;
  border-radius: 0px;
  background: #213F9B;
  box-shadow:  6px 6px 12px #0d193e, 
              -6px -6px 12px #3565f8;
}
.option:focus{
  outline: none;
  background: #213F9B!important;
}
.option:hover{
  opacity: 1;
  cursor: pointer;
    padding-left: 50px;
}
.selected{
  opacity: 1;
  cursor: pointer;
  padding-left: 50px;
}
#last{
  margin-bottom: 50px;
}
#appImage{
  position: fixed;
  height: 45vh;
  bottom: -60px;
  right: 7%;
  z-index: -1;
}
#logged{
  text-align: center;
  font-size: 16px;
  color: white;

}
</style>
