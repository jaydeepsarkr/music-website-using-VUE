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
          hover:border-green-400 hover:border-solid"
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
      <hr class="my-6" />

      <!-- Progress Bars -->
      <div v-for="(file, index) in uploads" :key="index" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm">{{ file.name}}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="progress-bar bg-blue-400 transition-all" :style="{ width: file.progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supabase from '@/includes/supabase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [], // Track multiple files
    };
  },
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

      const files = [...$event.dataTransfer.files];
      files.forEach(async (file, fileIndex) => {
        if (file.type !== 'audio/mpeg') {
          console.log('Only MP3 files are allowed.', `The number ${fileIndex + 1} is not a valid file type`);
          return;
        }

        // Add file to the uploads array
        const fileData = { name: file.name, progress: 0 };
        this.uploads.push(fileData);
        const index = this.uploads.length - 1; // Track correct index

        // Upload to Supabase
        const { data, error } = await supabase.storage.from('songs').upload(`songs/${file.name}`, file);

        if (error) {
          console.error('Error uploading file:', error.message || error);
        } else {
          this.uploads[index].progress = 10; // Start progress
          this.simulateProgress(index);
          console.log('File uploaded successfully:', data);
        }
      });
    },
  },
};
</script>
