import { createStore } from 'vuex';
import { auth, db } from '@/includes/firebase';
import {
  createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

    await setDoc(doc(db, 'users', userCred.user.uid), {
      name: payload.name,
      email: payload.email,
      age: payload.age,
      country: payload.country,
});
    await updateProfile(userCred.user, {
        displayName: payload.name,
      });

       commit('toggleAuth');
    },

    async login({ commit }, payload) {
      const loginAuth = getAuth(); // Initialize the auth instance
      await signInWithEmailAndPassword(loginAuth, payload.email, payload.password);
      commit('toggleAuth');
    },

    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },

    async signout({ commit }) {
    await auth.signOut();
        commit('toggleAuth');
        //   if (payload.route.meta.requiresAuth) {
        //   payload.router.push({ name: 'home' });
        // }
    },

    async newSong({ commit, state, dispatch }, payload) {
        commit('newSong', payload);

      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
  },

});
