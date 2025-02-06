<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item v-for="(song,i) in songs" :key="song.docID" :song="song"
            :updateSong="updateSong"
            :index="i"
            :removeSong="removeSong"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppUpload from '@/components/Upload.vue';
import { auth, songsCollection } from '@/includes/firebase';
import { getDocs, query, where } from 'firebase/firestore';
import compositionItem from '@/components/CompositionItem.vue';

export default {
  name: 'manage',
  components: {
    AppUpload,
    compositionItem,
  },
  data() {
    return {
      songs: [],
    };
  },
  async created() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // ✅ Correct way to query Firestore
          const q = query(songsCollection, where('uid', '==', user.uid));
          const snapshot = await getDocs(q);

          this.songs = snapshot.docs.map((doc) => ({
            ...doc.data(),
            docID: doc.id,
          }));
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      }
    });
  },
  computed: {},
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(song) {
      this.songs.push(song);
    },
  },
};
</script>
