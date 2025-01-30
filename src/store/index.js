import { createStore } from 'vuex';
import { auth, db } from '@/includes/firebase';
import {
  createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
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
  await signInWithEmailAndPassword(loginAuth, payload.email, payload.password); // Use modular signInWithEmailAndPassword
  commit('toggleAuth');
},

    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
     },
  },

});
