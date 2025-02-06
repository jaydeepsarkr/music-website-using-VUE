<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-green-800
          hover:border-green-400 hover:border-solid mb-6"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <label for="fileUpload" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer ">
        Choose Files
      </label>
      <input
        type="file"
        id="fileUpload"
        class="hidden"
        multiple
        @change="upload($event)"
      />
      <hr class="my-6" />
      <!-- Progress Bars -->
      <div v-for="(file, index) in uploads" :key="index" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm"><i :class="icon"></i>{{ file.name}}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="progress-bar transition-all"
            :class="{
              'bg-blue-400': file.status === 'success',
              'bg-red-400': file.status === 'failed',
            }"
            :style="{ width: file.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supabase from '@/includes/supabase';
import { auth, songsCollection } from '@/includes/firebase';
import { addDoc } from 'firebase/firestore';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
      icon: '',
    };
  },
  props: ['addSong'],
  methods: {
    simulateProgress(index) {
      const progressSteps = [20, 40, 60, 80, 100];
      progressSteps.forEach((step, i) => {
        setTimeout(() => {
          this.uploads[index].progress = step;
        }, (i + 1) * 1000);
      });
    },

    async upload($event) {
      this.is_dragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];
      files.forEach(async (file, fileIndex) => {
        if (file.type !== 'audio/mpeg') {
          console.log('Only MP3 files are allowed.', ` ${fileIndex + 1} is not a valid file type`);
          return;
        }

        // Add file to the uploads array
        const fileData = { name: file.name, progress: 0 };
        this.uploads.push(fileData);
        const index = this.uploads.length - 1; // Track correct index

        // Upload to Supabase
        const { data, error } = await supabase.storage.from('songs').upload(`songs/${file.name}`, file);

        if (error) {
          this.uploads[index].status = 'failed';
          this.uploads[index].progress = 100;
          console.error('Error uploading file to Supabase:', error ? error.message : 'Unknown error');
          this.icon = 'fas fa-times';
          return;
        }

        this.icon = 'fas fa-spinner fa-spin';
        this.uploads[index].status = 'success';
        this.uploads[index].progress = 10; // Start progress
        this.simulateProgress(index);
        setTimeout(() => {
          this.icon = 'fas fa-check';
          }, 5000); // 5 seconds delay
        console.log('File uploaded to Supabase successfully:', data);

        // Get the file URL from Supabase
        const { data: urlData } = supabase.storage.from('songs').getPublicUrl(`songs/${file.name}`);
        const fileUrl = urlData.publicUrl;

        // Ensure the user is authenticated
        if (!auth.currentUser) {
          console.error('User is not authenticated');
          return;
        }

        // Store metadata in Firebase Firestore
        const song = {
          id: data.id,
          uid: auth.currentUser.uid,
          display_name: auth.currentUser.displayName,
          original_name: file.name,
          modified_name: file.name,
          genre: '',
          comment_count: 0,
          url: fileUrl, // Store the Supabase file URL in Firebase
        };

        try {
          await addDoc(songsCollection, song);
          console.log('File metadata stored in Firebase:', song);
           this.addSong(song);
        } catch (err) {
          console.error('Error storing song data in Firebase:', err ? err.message : 'Unknown error');
        }
      });
    },
  },
};
</script>
