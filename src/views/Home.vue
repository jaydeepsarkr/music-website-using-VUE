<template>
<main>
    <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">{{ $t('home.listen') }}</h1>
        <p class="w-full md:w-8/12 mx-auto italic">
       {{ $t('homeParagraph.listen') }}
        </p>
      </div>
    </div>
    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"  alt="introduction-music"/>
  </section>

  <!-- Main Content -->
<section class="container mx-auto px-4 py-8">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon-secondary="{icon: 'headphones-alt', right: true}">
        <span class="card-title">Songs</span>
        <!-- Icon -->
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <app-song-item v-for="song in songs" :key="song.docID"
        :song="song"/>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import {
  getDocs,
 orderBy,
  query,
   startAfter,
    limit,
    } from 'firebase/firestore';
import AppSongItem from '@/components/SongItem.vue';
import IconSecondary from '@/directives/icon-secondary';

export default {
  name: 'Home',
  components: {
    AppSongItem,
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  data() {
    return {
      songs: [],
      lastDoc: null,
      isFetching: false,
      maxPerPage: 20,
    };
  },
  async created() {
    await this.fetchSongs(); // Load initial songs
    window.addEventListener('scroll', this.handleScroll); // Listen for scrolling
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async fetchSongs() {
      if (this.isFetching) return; // Prevent multiple requests
      this.isFetching = true;

      try {
        let songQuery = query(
          songsCollection,
          orderBy('modified_name'),
          limit(this.maxPerPage),
        );

        if (this.lastDoc) {
          songQuery = query(
            songsCollection,
            orderBy('modified_name'),
            startAfter(this.lastDoc),
            limit(this.maxPerPage),
          );
        }

        const snapshots = await getDocs(songQuery);

        if (!snapshots.empty) {
          const newSongs = snapshots.docs.map((doc) => ({
            docID: doc.id,
            ...doc.data(),
          }));

          this.songs = [...this.songs, ...newSongs];

          // Update lastDoc for pagination
          this.lastDoc = snapshots.docs[snapshots.docs.length - 1];
        } else {
          console.log('No more songs to load.');
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        this.isFetching = false;
      }
    },

    handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        this.fetchSongs(); // Fetch more songs when reaching bottom
      }
    },
  },
};
</script>
