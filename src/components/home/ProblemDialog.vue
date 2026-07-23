<template>
    <v-dialog v-model="dialog">
        <template #activator="{ props: activatorProps}">
            <v-btn class="problem" rounded="xl" v-bind="activatorProps">Є проблема!</v-btn>
        </template>
        <template #default="{ isActive }">
            <v-card class="problem-form" rounded="xl">
                <v-card-title>
                    <h2>Сповістити про проблему</h2>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="isValid">
                        <v-textarea v-model="description" placeholder="Опис проблеми" height="100" variant="outlined" no-resize :rules="[validations.minLength(20)]">
                        </v-textarea>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="handleSend()">Надіслати</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { useFetch } from '@/composables/useFetch';
import { useObjectDetails } from '@/stores/objectDetailsState';
import { validations } from '@/utils/constants/validations.constants';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const objectDetails = useObjectDetails();
const { show, object, objects } = storeToRefs(objectDetails);
const description = ref('');
const dialog = ref(false);
const form = ref(null);
const { put, response } = useFetch();
const isValid = ref()
async function handleSend() {
        const newIssue = {
            description: description.value,
            date: new Date().toISOString(),
            isResolved: false,
        }
        const { issues, ...rest } = object.value
        const data = {
            ...rest,
            issues: [ ...(issues? issues: []), newIssue],
        }
/*         await put(`http://192.168.234.128:5000/api/Ponds/${object.value.id}`, data)
        if(response.value.ok) {
            dialog.value = false;
        } */
        objectDetails.addToIssue(newIssue);
        dialog.value = false;
}
</script>
<style scoped lang="scss">
.problem {
    background-color: red;
    color: white;
    font-weight: bold;
}

.problem-form {
    width: 30vw;
    height: fit-content;
    position: absolute;
    padding: 1em;
    bottom: 50%;
    right: 50%;
    transform: translate(50%, 50%);
}
</style>