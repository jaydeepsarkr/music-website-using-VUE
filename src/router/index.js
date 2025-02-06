import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import song from '@/views/Song.vue';
import store from '@/store';

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    // alias: '/manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
    beforeEnter: (to, from, next) => {
      next();
     },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: song,
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkExactActiveClass: 'text-yellow-600',
});
router.beforeEach(
  (to, from, next) => {
    // console.log(to.matched);
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
      next();
      return;
    }
    if (store.state.userLoggedIn) {
      next();
    } else {
      next({ name: 'home' });
   }
   },
);

export default router;
