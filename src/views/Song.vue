<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
<main>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none" @click.prevent="newSong(song)">
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name}}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
<section class=" mx-auto mt-6 mb-3" id="comments">
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 flex justify-between items-center">
      <!-- Comment Count -->
      <span class="text-lg font-semibold text-gray-700">
        {{ $tc('song.comment_count', song.comment_count, { count: song.comment_count }) }}
      </span>
      <i class="fa fa-comments text-green-500 text-2xl"></i>
    </div>
    <div class="p-6">
      <div v-if="comment_show_alert" :class="[comment_alert_variant, 'text-white text-center font-bold p-4 mb-4 rounded']">
        {{ comment_alert_message }}
      </div>

        <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></vee-field>
            <ErrorMessage name="comment" class="text-red-600 "/>
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block mt-4" :disabled="comment_in_submission">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{comment.user}}</div>
        <time>{{comment.datePosted}}</time>
      </div>

      <p>{{comment.content}}</p>
    </li>
  </ul>
  </main>
</template>

<script>
import {
   doc,
    getDoc,
     addDoc,
      query,
       where,
        getDocs,
        updateDoc,
       } from 'firebase/firestore';
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted ',
      comments: [],
      sort: '1',
    };
  },
  computed: {
    ...mapState(['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const docRef = doc(songsCollection, this.$route.params.id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      this.$router.push({ name: 'home' });
      return;
    }
    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';
    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    ...mapActions(['newSong']),
    async addComment(values, { resetForm }) {
        this.comment_in_submission = true;
        this.comment_show_alert = true;
        this.comment_alert_variant = 'bg-blue-500';
        this.comment_alert_message = 'Please wait! Your comment is being submitted ';

        const comment = {
            content: values.comment,
            datePosted: new Date().toString().split(' ').slice(1, 4)
            .join(' '),
            sid: this.$route.params.id,
            user: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
        };
        await addDoc(commentsCollection, comment);
        this.song.comment_count += 1;

        const songDocRef = doc(songsCollection, this.$route.params.id);
        await updateDoc(songDocRef, {
          comment_count: this.song.comment_count,
        });

        this.getComments();
        this.comment_in_submission = false;
        this.comment_alert_variant = 'bg-green-500';
        this.comment_alert_message = 'Your comment has been submitted successfully!';
        resetForm();
    },
    async getComments() {
      const q = query(commentsCollection, where('sid', '==', this.$route.params.id));
      const snapshots = await getDocs(q);
      this.comments = [];

      snapshots.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data(),
        });
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
       query: {
         sort: newVal,
       },
      });
    },
  },
};
</script>
