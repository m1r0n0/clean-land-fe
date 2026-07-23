<template>
    <div ref="mapContainer" class="map"></div>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useObjects } from '@/stores/objectStore.js';
  import { useFetch } from '@/composables/useFetch';
  import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';

  const mapContainer = ref(null);
  const { toggleShow, showObject, updateMapToAdmin } = useObjects()
  const { isAdmin } = storeToRefs(useUserStore());
  const { map } = storeToRefs(useObjects());
  const { get, response, responseData } = useFetch()

  onMounted(async () => {
    const createdMap = L.map(mapContainer.value, { zoomControl: false }).setView([49.23, 28.46], 10);
    map.value = createdMap;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(createdMap);
    
    if(isAdmin.value) updateMapToAdmin();

  });
  </script>
  
  <style scoped>
  .map {
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }
  </style>
  