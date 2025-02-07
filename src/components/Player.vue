<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleAudio">
          <i class="fa  text-gray-500 text-xl" :class="{'fa-play': !playing, 'fa-pause': playing}"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left  h-7 leading-3 text-gray-400  text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
        v-if="currentSong.modified_name">
          <span class="song-title">{{currentSong.modified_name}} -</span>
          <span class="song-artist">(Uploaded by {{currentSong.display_name}})</span>
        </div>
        <!-- Scrub Container  -->
        <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
        @click.prevent="updateSeek($event)" @keydown.space="toggleAudio">
          <!-- Player Ball -->
          <span class="absolute top-neg-8 text-gray-800 text-lg" :style="{ left: playerProgress }">
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
           :style="{ width: playerProgress }"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left  h-7 leading-3 text-gray-400  text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: 'Player',
    computed: {
       ...mapGetters(['playing']),
       ...mapState(['seek', 'duration', 'playerProgress', 'currentSong']),
    },
methods: {
  ...mapActions(['toggleAudio', 'updateSeek']),

  handleKeydown(event) {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent scrolling when pressing Space
      this.toggleAudio();
    } else if (event.code === 'ArrowRight') {
      this.seekForward();
    } else if (event.code === 'ArrowLeft') {
      this.seekBackward();
    }
  },

  seekForward() {
    if (this.currentSong && this.$store.state.sound) {
      const newTime = this.$store.state.sound.seek() + 5; // Forward 5 seconds
      this.$store.state.sound.seek(newTime);
    }
  },

  seekBackward() {
    if (this.currentSong && this.$store.state.sound) {
      const newTime = Math.max(this.$store.state.sound.seek() - 5, 0); // Rewind 5 seconds
      this.$store.state.sound.seek(newTime);
    }
  },
},
mounted() {
  window.addEventListener('keydown', this.handleKeydown);
},

beforeUnmount() {
  window.removeEventListener('keydown', this.handleKeydown);
},

};
</script>
