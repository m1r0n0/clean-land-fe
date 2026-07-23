<template>
      <div v-if="items && items.length">
        <v-window v-model="current" :show-arrows="false" class="mb-2">
          <v-window-item
            v-for="(item, i) in items"
            :key="item.id || i"
            :value="i"
            class="pa-2"
          >
          
          <v-card class="pa-4 problem-card">
            <div class="d-flex flex-column ga-2">
              <div class="d-flex justify-space-between align-center">
                <v-chip v-if="item.isResolved" :color="item.isAccepted ? 'success' : 'error'" size="x-small" variant="flat">
                  {{ item.isAccepted ? 'Прийнято' : 'Відхилено' }}
                </v-chip>
                <v-dialog v-if="item.image" max-width="600">
                  <template #activator="{ props: dialogProps }">
                    <v-btn v-bind="dialogProps" variant="text" icon density="compact" class="ml-auto">
                      <v-icon icon="mdi-image" color="primary"></v-icon>
                    </v-btn>
                  </template>
                  <v-card class="pa-2 text-center">
                    <img :src="item.image" style="width: 100%; max-height: 80vh; object-fit: contain;" />
                  </v-card>
                </v-dialog>
              </div>

              <div class="problem-text">
                {{ item.description }}
              </div>

              <!-- Admin Action Buttons on Item Info Card -->
              <div v-if="isAdmin && !item.isResolved" class="d-flex flex-row justify-end ga-2 mt-2">
                <v-btn size="small" color="success" rounded="xl" variant="tonal" @click="objectsStore.resolveIssue(item, true)">
                  Прийняти
                </v-btn>
                <v-btn size="small" color="error" rounded="xl" variant="tonal" @click="objectsStore.resolveIssue(item, false)">
                  Відхилити
                </v-btn>
              </div>

              <div v-else-if="isAdmin && item.isResolved" class="d-flex justify-end mt-1">
                <v-btn size="x-small" color="grey-darken-1" variant="text" @click="objectsStore.reopenIssue(item)">
                  Відновити
                </v-btn>
              </div>
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
      </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/userStore';
  import { useObjects } from '@/stores/objectStore';
  
  const props = defineProps({
    items: {
      type: Array,
      default: () => []
    }
  });

  const userStore = useUserStore();
  const { isAdmin } = storeToRefs(userStore);
  const objectsStore = useObjects();
  const current = ref(0);
  </script>

  <style scoped lang="scss">
  .problem-card {
    font-size: 1.1rem;
    border-radius: 1em;
    @include shadow(3px);
  }
  .problem-text {
    word-break: break-word;
  }
  </style>
  