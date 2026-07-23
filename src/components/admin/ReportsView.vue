<template>
    <v-dialog v-model="dialog" max-width="850">
      <template #activator="{ on, attrs }">
        <v-btn @click="openEditor">
            <v-icon icon="mdi-message-badge" size="large" :title="$t('Create')"></v-icon>
        </v-btn>
      </template>
      <v-card class="w-full">
        <v-card-title class="pa-4 d-flex justify-between align-center">
            <h3>Звіти про проблеми</h3>
            <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false"></v-btn>
        </v-card-title>
        
        <v-tabs v-model="activeTab" color="green-darken-2" class="px-4">
            <v-tab value="active">
                Активні проблеми
                <v-chip class="ml-2" color="red" size="x-small" v-if="totalActiveIssuesCount">{{ totalActiveIssuesCount }}</v-chip>
            </v-tab>
            <v-tab value="archive">
                Архів проблем
                <v-chip class="ml-2" color="grey" size="x-small" v-if="totalArchivedIssuesCount">{{ totalArchivedIssuesCount }}</v-chip>
            </v-tab>
        </v-tabs>

        <v-card-text class="w-full pa-4">
            <v-window v-model="activeTab">
                <!-- ACTIVE ISSUES TAB -->
                <v-window-item value="active">
                    <div v-if="!objectsStore.objectsWithReports.length" class="text-center py-6 text-grey">
                        Активних проблем не виявлено
                    </div>
                    <v-expansion-panels v-else v-for="object of objectsStore.objectsWithReports" :key="object.id" class="w-full mb-3">
                        <v-expansion-panel class="w-full">
                            <v-expansion-panel-title>
                                <span class="name">{{ object.name + ", "}}</span>
                                <span class="district">{{ object.district }}</span>
                                <v-badge :content="object.issues.filter(i => !i.isResolved).length" color="red" inline size="small" density="compact" />
                            </v-expansion-panel-title>
                            <v-expansion-panel-text class="w-full">
                                <v-card class="pa-4 problem-card w-full mb-3" v-for="issue of object.issues.filter(i => !i.isResolved)" :key="issue.id">
                                    <div class="d-flex flex-column gap-2 mb-3">
                                        <img v-if="issue.image" :src="issue.image" class="issue-image mb-2 rounded-lg" style="max-height: 200px; max-width: 100%; object-fit: contain;" />
                                        <span>{{ issue.description }}</span>
                                        <span v-if="issue.date" class="text-caption text-grey mt-1">{{ formatDate(issue.date) }}</span>
                                    </div>
                                    <div class="d-flex flex-row justify-end ga-3" >
                                        <v-btn color="success" rounded="xl" variant="tonal" @click="objectsStore.resolveIssue(issue, true)">
                                            Прийняти
                                        </v-btn>
                                        <v-btn color="error" rounded="xl" variant="tonal" @click="objectsStore.resolveIssue(issue, false)">
                                            Відхилити
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-window-item>

                <!-- ARCHIVED ISSUES TAB -->
                <v-window-item value="archive">
                    <div v-if="!objectsStore.objectsWithArchivedReports.length" class="text-center py-6 text-grey">
                        Архів порожній
                    </div>
                    <v-expansion-panels v-else v-for="object of objectsStore.objectsWithArchivedReports" :key="object.id" class="w-full mb-3">
                        <v-expansion-panel class="w-full">
                            <v-expansion-panel-title>
                                <span class="name">{{ object.name + ", "}}</span>
                                <span class="district">{{ object.district }}</span>
                                <v-badge :content="object.issues.filter(i => i.isResolved).length" color="grey" inline size="small" density="compact" />
                            </v-expansion-panel-title>
                            <v-expansion-panel-text class="w-full">
                                <v-card class="pa-4 problem-card w-full mb-3" v-for="issue of object.issues.filter(i => i.isResolved)" :key="issue.id">
                                    <div class="d-flex justify-between align-center mb-2">
                                        <v-chip :color="issue.isAccepted ? 'success' : 'error'" size="small" variant="flat">
                                            {{ issue.isAccepted ? 'Прийнято' : 'Відхилено' }}
                                        </v-chip>
                                        <span v-if="issue.date" class="text-caption text-grey">{{ formatDate(issue.date) }}</span>
                                    </div>
                                    <div class="d-flex flex-column gap-2 mb-3">
                                        <img v-if="issue.image" :src="issue.image" class="issue-image mb-2 rounded-lg" style="max-height: 200px; max-width: 100%; object-fit: contain;" />
                                        <span>{{ issue.description }}</span>
                                    </div>
                                    <div class="d-flex justify-end">
                                        <v-btn size="small" color="grey-darken-1" variant="outlined" rounded="xl" @click="objectsStore.reopenIssue(issue)">
                                            Відновити в активні
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-window-item>
            </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useObjects } from '@/stores/objectStore';
  
  const dialog = ref(false);
  const activeTab = ref('active');
  const objectsStore = useObjects();

  const totalActiveIssuesCount = computed(() => {
    return objectsStore.objectsWithReports.reduce((acc, obj) => {
        return acc + (obj.issues ? obj.issues.filter(i => !i.isResolved).length : 0);
    }, 0);
  });

  const totalArchivedIssuesCount = computed(() => {
    return objectsStore.objectsWithArchivedReports.reduce((acc, obj) => {
        return acc + (obj.issues ? obj.issues.filter(i => i.isResolved).length : 0);
    }, 0);
  });

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toLocaleString();
    } catch {
        return dateStr;
    }
  }

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