<template>
  <div class="about-page flex justify-center items-center min-h-screen bg-gray-100 p-6">
    <div class="about-container max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 text-center">
      <h1 class="title text-3xl font-bold text-gray-800 mb-4">About Us</h1>
      <p class="description text-lg text-gray-600 mb-6">
        Welcome to <span class="highlight text-blue-500 font-semibold">MusicVibe</span>, your ultimate destination for discovering, streaming, and enjoying the best music from around the world.
      </p>
      <div class="features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="feature-card flex flex-col items-center bg-gray-50 p-4 rounded-xl shadow-md transition-transform transform hover:scale-105"
          v-for="(feature, index) in features"
          :key="index"
        >
          <img :src="feature.icon" class="feature-icon w-16 h-16 mb-3" alt="Icon" />
          <h3 class="feature-title text-xl font-semibold text-gray-700 mb-2">{{ feature.title }}</h3>
          <p class="feature-description text-gray-500 text-sm text-center">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        { title: 'High-Quality Music', description: 'Experience the best sound quality with our curated music library.', icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063826.png' },
        { title: 'Personalized Playlists', description: 'Create and customize playlists to match your mood.', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png' },
        { title: 'Live Streaming', description: 'Tune in to live performances and radio stations anytime.', icon: 'https://cdn-icons-png.flaticon.com/512/2344/2344112.png' },
        { title: 'Offline Listening', description: 'Download your favorite songs and listen to them offline.', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921819.png' },
        { title: 'Social Sharing', description: 'Share your favorite tracks and playlists with friends and family.', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921817.png' },
        { title: '24/7 Support', description: 'Get help and assistance from our dedicated customer support team.', icon: 'https://cdn-icons-png.flaticon.com/512/2921/2921818.png' },
      ],
    };
  },
};
</script>
