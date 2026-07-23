<template>
      <v-window v-model="current" :show-arrows="false" class="mb-2">
        <v-window-item
          v-for="(item, i) in items"
          :key="i"
          :value="i"
          class="pa-5"
        >
        
        <v-card class="pa-4 problem-card">
          <div class="d-flex justify-center align-center">
              {{ item.description }}
              <v-dialog max-width="600">
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="plain" icon class="ml-2">
                    <v-icon icon="mdi-image"></v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <img :src="item.image" style="width: 100%; height: 100%; object-fit: contain;"></img>
                </v-card>
              </v-dialog>
          </div>
        </v-card>
        </v-window-item>
      </v-window>
  
      <div class="d-flex justify-center align-center ga-2" v-if="items.length > 1">
        <v-btn
          icon="mdi-arrow-left"
          variant="outlined"
          size="small"
          :disabled="current === 0"
          @click="current--"
        ></v-btn>
  
        <span>{{ current + 1 }} / {{ items.length }}</span>
  
        <v-btn
          icon="mdi-arrow-right"
          variant="outlined"
          size="small"
          :disabled="current === items.length - 1"
          @click="current++"
        ></v-btn>
      </div>
  </template>
  
  <script setup>
  import axios from 'axios'
import { onMounted, ref, watch, watchEffect } from 'vue'
  
const props = defineProps({
    items: {
      type: Array,
    }
  })
  
  const current = ref(0)
  const viewItems = ref([])

  watchEffect(async () => {
    if(props.items.length > 0) {
    const promises = props.items.map(async (item) => {
      const response = await axios.get("http://localhost:5000/api/Images/" + item.id, {
        responseType: 'blob'
      })
      item.image = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }))
      return item;
    })
    viewItems.value = await Promise.all(promises)
    console.log(viewItems.value)
    } else {
      viewItems.value = props.items
    }
    
  })
  </script>
  <style scoped lang="scss">
.problem-card {
  font-size: 1.1rem;
  border-radius: 1em;
  @include shadow(3px);
}
</style>
  