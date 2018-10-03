<template lang="html">
  <div id="auth">
    <h1>You should be authenticate to use the application</h1>
    <div id="firebaseui-auth-container"></div>
    <span>it's just to play with your avatar ;). We won't sell your datas!</span>
  </div>
</template>
<script>
import firebase from 'firebase';
import firebaseui from 'firebaseui'
import {config} from '../firebase/firebase-config.js';
export default {
  name: 'auth',
  mounted() {
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ]
      };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    },
}
</script>
<style scoped>
#auth{
  color: white;
}
</style>