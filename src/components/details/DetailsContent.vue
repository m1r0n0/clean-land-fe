<template>
    <template v-if="object">
            <h2 class="details__name" v-title:overflow>
                {{ object.name }}
            </h2>
            <div class="details__criticity" v-tooltip:top="object.criticalityScore + '/10'">
                <v-rating
                :length="criticalityMax"
                v-model="criticality"
                size="small"
                density="compact"
                empty-icon="mdi-circle"
                color="#aaa"
                full-icon="mdi-circle"
                :active-color="criticityColor"
                readonly
                >
            </v-rating>
            </div>
            
            <v-btn variant="plain" @click="objectsStore.toggleShow()" size="xs" density="compact" class="details__close">
                <v-icon icon="mdi-close"></v-icon>
            </v-btn>
            <h1 class="details__district" v-title:overflow>
                {{ object.district || "Вінницька обл., Оратівський район" }}
            </h1>
                <span class="details__coords">
                    <v-icon icon="mdi-map-marker-outline"/>
                    <a :href="getGoogleMapsHref(object.xLocation, object.yLocation)" target="_blank">
                        {{ object.xLocation + ', ' + object.yLocation }}
                    </a>
                </span>
            <div class="details__actions">
                <v-btn class="donate" variant="outlined" rounded="xl">{{ $t('Donate')}}</v-btn>
                <ProblemDialog v-slot="{ activatorProps}">
                    <v-btn class="problem" rounded="xl" v-bind="activatorProps">{{ $t('ThereIsProblem')}}</v-btn>
                </ProblemDialog>
            </div>
            <div class="details__problems">
                <span class="title">                
                        <span v-if="object.issues?.length">{{ $t("DetectedProblems") }}
                            <v-badge :content="object.issues.filter(i => !i.isResolved).length" color="red" inline size="small" density="compact" v-if="object.issues.filter(i => !i.isResolved).length"/>
                        </span>
                        <span v-else>{{ $t("ProblemsAreNotDetected") }}</span>
                </span>
                <ProblemsGallery v-if="object.issues && object.issues.length" :items="object.issues"/>
            </div>
                <span class="details__table__title title">                
                        <span>{{ $t("InformationAboutObject") }}</span>
                </span>
                <div class="details__table" :class="{ 'details__table--no-problems': !object.issues?.length }">
                    <PondTable :object="object" v-if="object.assetType === 'Pond'"/>
                    <ForestTable :object="object" v-if="object.assetType === 'Forest'"/>
                </div>
        </template>
</template>
<script setup>
import ProblemDialog from '@/components/details/ProblemDialog.vue';
import { useObjects } from '@/stores/objectStore';
import { getGoogleMapsHref } from '@/utils/helpers/getGoogleMapHref';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ProblemsGallery from '../details/ProblemsGallery.vue';
import { useCriticality } from '@/composables/useCriticality';
import PondTable from './PondTable.vue';
import ForestTable from './ForestTable.vue';

const objectsStore = useObjects();
const { t } = useI18n();
const { object } = storeToRefs(objectsStore);
const { criticalityMax, criticality, criticityColor } = useCriticality(computed(() => object.value?.criticalityScore ?? 0))
</script>
<style>
.problem {
    background-color: red;
    color: white;
    font-weight: bold;
}
</style>