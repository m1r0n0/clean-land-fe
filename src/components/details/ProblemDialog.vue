<template>
    <v-dialog v-model="dialog">
        <template #activator="{ props: activatorProps}">
            <slot :activatorProps="activatorProps"></slot>
        </template>
        <template #default="{ isActive }">
            <v-card class="problem-form" rounded="lg">
                <v-card-title>
                    <h2>{{ $t('NotifyAboutProblem') }}</h2>
                </v-card-title>
                <v-card-text class="d-flex flex-column ga-sm-2">
                    <p class="mb-3" style="font-weight: 500;">{{ $t("If you detect any ecological issues on this site, please let us know. Describe the problem in a few sentences.") }}</p>
                    <v-form ref="form" v-model="isValid">
                        <v-textarea v-model="description" :placeholder="$t('DescribeProblem')" variant="outlined" no-resize :rules="[validations.minLength(20), validations.required]">
                        </v-textarea>
                        <div class="d-flex py-2">
                            <img v-if="imageFile" :src="previewImageSrc" class="preview-image"/>
                            <v-file-input v-model="imageFile" variant="outlined" :placeholder="$t('UploadImage')" :rules="[validations.required]" accept="image/*" >
                            </v-file-input>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="handleSend()" class="mr-3 mb-3" :loading="loadingStore.isLoading">{{ $t('Send') }}</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { useFetch } from '@/composables/useFetch';
import { useHandledAsync } from '@/composables/useHandledAsync';
import { useLoadingStore } from '@/stores/loading.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useObjects } from '@/stores/objectStore.js';
import { validations } from '@/utils/constants/validations.constants';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const objectsStore = useObjects();
const { show, object, objects } = storeToRefs(objectsStore);
const description = ref('');
const imageFile = ref(null);
const previewImageSrc = computed(() => {
    return imageFile.value ? URL.createObjectURL(imageFile.value): null;
})
const dialog = ref(false);
const form = ref(null);
const notifications = useNotificationStore();
const isValid = ref()
const { getActionWithHandling } = useHandledAsync();
const loadingStore = useLoadingStore();
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

async function handleSend() {
    await getActionWithHandling(async () => {
        if(!isValid.value) return;

        let imageBase64 = null;
        if (imageFile.value) {
            const rawFile = Array.isArray(imageFile.value) ? imageFile.value[0] : imageFile.value;
            if (rawFile) {
                imageBase64 = await convertFileToBase64(rawFile);
            }
        }

        const newIssue = {
            description: description.value,
            date: new Date().toISOString(),
            isResolved: false,
            isAccepted: false,
            image: imageBase64,
        }
        if(object.value.assetType === "Forest") {
            newIssue.forestId = object.value.id;
            newIssue.pondId = null;
        } else {
            newIssue.forestId = null;
            newIssue.pondId = object.value.id;
        }

        const response = await axios.post("http://localhost:5000/api/Issues", newIssue);

        if (response.data) {
            if (!object.value.issues) {
                object.value.issues = [];
            }
            object.value.issues.push(response.data);
        }

        description.value = '';
        imageFile.value = null;
        dialog.value = false;
        notifications.show("Problem successfully created!")
    })()
}
</script>
<style lang="scss">
.problem-form {
    width: 40vw;
    height: fit-content;
    position: fixed;
    padding: 1em;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
}

.preview-image {
    width: 25%;
    max-height: 100%;
    object-fit: fit;
    border-radius: 1.5em;
    padding: 1em;
}
</style>