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
                :class="{'bg-green-400 border-green-400 border-solid': is_dragover}"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)" >
              <h5>Drop your files here</h5>
            </div>
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4">
              <!-- File Name -->
              <div class="font-bold text-sm" >{{ uploadResponse}}</div>
              <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                <!-- Inner Progress Bar -->
                <div class="progress-bar bg-blue-400 transition-all" :style="{ width: progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
import supabase from '@/includes/supabase';

export default {
  name: 'upload',
  data() {
    return {
      is_dragover: false,
      progress: 0,
      uploadResponse: '',
    };
  },
  methods: {
    simulateProgress() {
      setTimeout(() => { this.progress = 20; }, 1000);
      setTimeout(() => { this.progress = 40; }, 2000);
      setTimeout(() => { this.progress = 60; }, 3000);
      setTimeout(() => { this.progress = 80; }, 4000);
      setTimeout(() => { this.progress = 100; }, 5000);
    },

    async upload($event) {
      this.is_dragover = false;
      console.log(this.is_dragover);

      const files = [...$event.dataTransfer.files];
      files.forEach(async (file) => {
        if (file.type !== 'audio/mpeg') {
          console.log('Only MP3 files are allowed.');
          return;
        }

        // Upload the file to Supabase Storage
        const { data, error } = await supabase
          .storage
          .from('songs')
          .upload(`songs/${file.name}`, file);

        if (error) {
          this.uploadResponse = 'Upload failed!'; // Just assign the value directly
          console.error('Error uploading file:', error.message || error);
        } else {
          this.uploadResponse = `File uploaded: ${data.path}`; // Direct assignment
          console.log('File uploaded successfully:', data);
          this.simulateProgress();
        }
      });
    },
  },
};

</script>
