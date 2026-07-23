<template>
    <v-dialog v-model="dialog" max-width="800">
      <template #activator="{ on, attrs }">
        <v-btn @click="openEditor">
            <v-icon icon="mdi-message-badge" size="large" :title="$t('Create')"></v-icon>
        </v-btn>
      </template>
      <v-card class="w-full">
        <v-card-text class="w-full d-flex flex-column ga-3">
            <v-expansion-panels v-for="object of objectsStore.objectsWithReports" :key="object.id" class="w-full">
                <v-expansion-panel class="w-full">
                    <v-expansion-panel-title>
                        <span class="name">{{ object.name + ",    "}}</span>
                        <span class="district">{{ object.district }}</span>
                        <v-badge :content="object.issues.filter(i => !i.isResolved).length" color="red" inline size="small" density="compact" />
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="w-full">
                        <v-card class="pa-4 problem-card w-full" v-for="issue of object.issues.filter(i => !i.isResolved)" :key="issue.id">
                            <div class="d-flex flex-column gap-2 mb-3">
                                <img v-if="issue.image" :src="issue.image" class="issue-image mb-2 rounded-lg" style="max-height: 200px; max-width: 100%; object-fit: contain;" />
                                <span>{{ issue.description }}</span>
                            </div>
                            <div class="d-flex flex-row justify-between ga-3" >
                                <v-btn rounded="xl" variant="outlined">Accept</v-btn>
                                <v-btn rounded="xl" variant="outlined">Decline</v-btn>
                            </div>
                        </v-card>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue';
  import axios from 'axios';
  import { useObjects } from '@/stores/objectStore';
  
  const dialog = ref(false);
  const objectsStore = useObjects();

    function openEditor() {
    dialog.value = true;
  }
  </script>
  
  <style scoped lang="scss">
  .v-card-text {
    max-height: 75vh;
    overflow-y: auto;
  }
.v-expansion-panel-title {
    display: flex;
    align-items: center;
    & .name {
        font-weight: 500;
        font-size: 1.5rem;
        text-decoration: underline;
        @include text-ellipsis;
    }
    
    & .district {
        font-weight: 400;
        font-size: 1.5rem;
        text-decoration: underline;
        @include text-ellipsis;
    }
}
  </style>