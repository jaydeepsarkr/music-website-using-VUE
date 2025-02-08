import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';

const Home = () => import('@/views/Home.vue');
const Manage = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Manage.vue');
const Song = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Song.vue');
const About = () => import('@/views/About.vue');

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
    component: Song,
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
