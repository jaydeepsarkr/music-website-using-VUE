<template>
  <app-header/>

  <router-view></router-view>
  <app-player/>
  <AuthModal/>
</template>

<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Authentication.vue';
import AppPlayer from './components/Player.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    AppPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>
