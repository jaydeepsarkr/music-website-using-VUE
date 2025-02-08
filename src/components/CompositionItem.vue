<!-- eslint-disable no-alert -->
<template>
  <!-- Composition Items -->
  <div class="border border-gray-200 p-4 mb-4 rounded-lg shadow-md bg-white transition duration-300 hover:shadow-lg">
    <!-- Display Song Details -->
    <div v-show="!showForm" class="flex justify-between items-center">
      <h4 class="text-2xl font-bold text-gray-700">{{ song.modified_name }}</h4>
      <div>
        <!-- Edit Button -->
        <button class="py-1.5 px-3 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          @click.prevent="showForm = !showForm">
          <i class="fa fa-pencil-alt"></i>
        </button>
        <!-- Delete Button -->
        <button class="py-1.5 px-3 text-sm rounded-md text-white bg-red-600 hover:bg-red-700 transition ml-2"
          @click.prevent="deleteSong">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-show="showForm">
      <!-- Alert Message -->
      <div v-if="show_alert" class="text-white text-center font-bold p-4 mb-4 rounded-md" :class="alert_variant">
        {{ alert_message }}
      </div>

      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <!-- Song Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600 mb-2">Song Title</label>
          <vee-field type="text" name="modified_name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600 text-sm mt-1" name="modified_name" />
        </div>

        <!-- Genre -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600 mb-2">Genre</label>
          <vee-field type="text" name="genre"
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600 text-sm mt-1" name="genre" />
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 mt-4">
          <button type="submit"
            class="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
            :disabled="in_submission">
            Submit
          </button>
          <button type="button"
            class="py-2 px-4 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition"
            :disabled="in_submission"
            @click.prevent="showForm = false">
            Go Back
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import {
   updateDoc,
 doc,
deleteDoc,

 } from 'firebase/firestore';
import supabase from '@/includes/supabase';

export default {
  name: 'compositionItems',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info.',
    };
  },
  methods: {
    async edit(values) {
        this.in_submission = true;
        this.show_alert = true;
        this.alert_variant = 'bg-blue-500';
        this.alert_message = 'Please wait! Updating song info.';
      try {
        // Get document reference
        const songRef = doc(songsCollection, this.song.docID);
        // Update document
        await updateDoc(songRef, values);
      } catch (error) {
        console.error('Error updating song:', error);
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Error updating song. Please try again.';
        return;
      } finally {
        this.updateSong(this.index, values);
        this.updateUnsavedFlag(false);
        this.in_submission = false;
        this.alert_variant = 'bg-green-500';
        this.alert_message = 'Song info updated successfully!';
      }
    },
      async deleteSong() {
          const confirmation = window.confirm('Are you sure you want to delete this song? This action cannot be undone.');

  if (!confirmation) {
    return;
  }
        try {
          const songUrl = this.song.url;
          const filePath = decodeURIComponent(songUrl.split('/storage/v1/object/public/')[1]);
          console.log('Extracted file path:', filePath);

          if (!filePath) {
            console.error('Error: File path could not be extracted');
            return;
          }
          // Send the deletion request to Supabase
          const { error } = await supabase.storage.from('songs').remove([filePath]);

          if (error) {
            console.error('Error deleting file from Supabase:', error.message);
          } else {
            console.log('File deletion request sent to Supabase successfully.');
          }
          // ✅ Verify by checking if the file still exists in Supabase
          const { data: checkFile, error: checkError } = await supabase.storage.from('songs').list('');

          if (checkError) {
            console.error('Error checking file existence:', checkError.message);
          } else {
            const fileStillExists = checkFile.some((file) => file.name === filePath);

            if (fileStillExists) {
              console.error('File still exists after deletion! Possible cache issue.');
            } else {
              console.log('File successfully deleted from Supabase.');
            }
          }
          // Delete song metadata from Firebase (or other database) after successful deletion
          const songRef = doc(songsCollection, this.song.docID);
          await deleteDoc(songRef);
          console.log('Song metadata deleted from Firebase successfully');
        } catch (error) {
          console.error('Error deleting song from Firebase and Supabase:', error);
        }

        this.removeSong(this.index);
      },

     },

};
</script>
