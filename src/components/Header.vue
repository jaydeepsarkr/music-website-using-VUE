<template>
 <!-- Header -->
  <header id="header" class="bg-gray-700 shadow-md mb-[2px]">
    <nav class="container mx-auto flex justify-between items-center py-4 px-6">

      <!-- App Name -->
      <router-link class="text-white font-extrabold uppercase text-2xl tracking-wide hover:text-blue-400 transition-all duration-300 mr-4"
        :to="{ name: 'home' }" exact-active-class="no-active">
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row space-x-6">
          <!-- Navigation Links -->
          <li>
            <router-link class="text-white font-semibold hover:text-blue-400 transition duration-300" to="/about">About</router-link>
          </li>
          <li v-if="!userLoggedIn">
            <a class="text-white font-semibold hover:text-blue-400 transition duration-300" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="text-white font-semibold hover:text-blue-400 transition duration-300" to="/manage">Manage</router-link>
            </li>
            <li>
              <a class="text-white font-semibold hover:text-red-400 transition duration-300" href="#" @click.prevent="signout">Logout</a>
            </li>
          </template>
        </ul>

        <!-- Language Switcher -->
        <ul class="flex flex-row ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full px-5 py-2 shadow-lg">
          <li>
            <a href="#"
              class="px-4 py-1 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-yellow-300"
              @click.prevent="changeLocal">
              {{ currentLocale }}
            </a>
          </li>
        </ul>

      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState(['userLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'HI' ? 'Hindi' : 'English';
    },

  },
 methods: {
   ...mapMutations(['toggleAuthModal']),
    signout() {
      this.$store.dispatch('signout', {
        router: this.$router,
        route: this.$route,
      });

      // console.log(this.$$route);
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' });
      }
    },
    changeLocal() {
     this.$i18n.locale = this.$i18n.locale === 'HI' ? 'en' : 'HI';
    },
  },

//  toggleAuthModal() {
//    this.$store.commit('toggleAuthModal');
//  },

};
</script>
