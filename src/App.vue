<template>
  <app-header/>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
        <component :is="Component" />
    </transition>
  </router-view>
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

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
