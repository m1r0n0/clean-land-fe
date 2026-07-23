import axios from "axios";
import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, watchEffect } from "vue";
import mock from '@/api/mock/mock.json'
import { Ecosystem } from "@/utils/constants/ecosystem.contants";
import { getCircleStyle } from "@/utils/helpers/getCircleStyle";
import { Crit } from "@/utils/constants/crit.constants";
import { useUserStore } from "./userStore";

export const useObjects = defineStore('objectDetails', () => {
    const map = ref(null);
    const show = ref(false);
    const object = ref(null);
    const isForests = ref(true);
    const isPonds = ref(true);
    const searchValue = ref('');
    const ecoFilters = ref([]);
    const critFilters = ref([]);
    const rawForests = ref([]);
    const rawPonds = ref([]);
    const objects = ref([]);
    const action = ref('');
    const { isAdmin } = storeToRefs(useUserStore());

    async function fetchData() {
        if (!rawForests.value.length) {
          const { data } = await axios.get("http://localhost:5000/api/Forest");
          rawForests.value = data;
          //const mockForests = mock.filter(item => item.treesAmount);
          //rawForests.value.push(...mockForests)
        }

        if (!rawPonds.value.length) {
          const { data } = await axios.get("http://localhost:5000/api/Ponds");
          rawPonds.value = data;
          //const mockPonds = mock.filter(item => !item.treesAmount);
          //rawPonds.value.push(...mockPonds);
        }
    }

    function updateObjects() {
        let result = [];
        if (ecoFilters.value.includes(Ecosystem.FOREST)) result.push(...rawForests.value);
        if (ecoFilters.value.includes(Ecosystem.POND)) result.push(...rawPonds.value);

        if(!ecoFilters.value.length) {
            result.push(...rawForests.value);
            result.push(...rawPonds.value);
        }

        if(critFilters.value.length) {
            let withCrit = [];
            if(critFilters.value.includes(Crit.LOW)) {
                withCrit = withCrit.concat(result.filter((o) => o.criticalityScore <= 4))
            }
            if(critFilters.value.includes(Crit.MEDIUM)) {
                withCrit = withCrit.concat(result.filter((o) => o.criticalityScore > 4 && o.criticalityScore < 7))
            }
            if(critFilters.value.includes(Crit.HIGH)) {
                withCrit = withCrit.concat(result.filter((o) => o.criticalityScore >=7 ))
            }
            result = withCrit;
            console.log(withCrit)
        }
        objects.value = result;
        renderObjectsOnMap();
    }

    watchEffect(updateObjects);

    function renderObjectsOnMap() {
        if (!map.value) return;

        clearMap();

        objects.value = objects.value.map(obj => {
            const marker = L.circle([obj.xLocation, obj.yLocation], getCircleStyle(obj));

            marker.addTo(map.value).bindPopup(obj.name);

            marker.on('click', () => activateObject(obj))
            if(isAdmin.value && obj.issues?.length && obj.issues.some((issue) => !issue.isResolved)) {//TODO: Change on !issue.isAccepted or smth
                const messageIndicator = L.divIcon({
                    className: '',
                    html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 7C21.394 7 21.7841 6.9224 22.1481 6.77164C22.512 6.62087 22.8427 6.3999 23.1213 6.12132C23.3999 5.84274 23.6209 5.51203 23.7716 5.14805C23.9224 4.78407 24 4.39397 24 4C24 3.60603 23.9224 3.21593 23.7716 2.85195C23.6209 2.48797 23.3999 2.15726 23.1213 1.87868C22.8427 1.6001 22.512 1.37913 22.1481 1.22836C21.7841 1.0776 21.394 1 21 1C20.2044 1 19.4413 1.31607 18.8787 1.87868C18.3161 2.44129 18 3.20435 18 4C18 4.79565 18.3161 5.55871 18.8787 6.12132C19.4413 6.68393 20.2044 7 21 7ZM21 9C21.3433 9 21.6767 8.96667 22 8.9V18C22 18.2652 21.8946 18.5196 21.7071 18.7071C21.5196 18.8946 21.2652 19 21 19H6.455L2 22.5V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H16.1C16.0333 3.324 16 3.65733 16 4C16 5.32608 16.5268 6.59785 17.4645 7.53553C18.4021 8.47322 19.6739 9 21 9Z" fill="#061B09"/>
                           </svg>`,
                    iconSize: [30, 30],
                    iconAnchor: [10, 15],
                  });
                  L.marker([obj.xLocation, obj.yLocation], {icon: messageIndicator}).addTo(map.value);
            }
            obj.mapMarker = marker;
            return obj;
        });
    }
    const searchSuggests = computed(() => {
            return objects.value
            .filter(item => item.name.toLowerCase().includes(searchValue.value.toLowerCase()))
    })

    function toggleShow() {
        show.value = !show.value;
    }

    function showObject(obj) {
        show.value = false;
        object.value = obj;
        map.value.flyTo(object.value.mapMarker.getLatLng(), 12, {
            animate: true,
            duration: 1,
            easeLinearity: 0.5,
        });
        show.value = true;
    }

    function setObject(obj) {
        object.value = obj;
    }

    function setAction(newAction) {
        action.value = newAction;
    }

    function clearAction() {
        action.value = null;
    }
    function activateObject(obj) {
        if(!action.value) {
            showObject(obj);
        }

        if(action.value === "delete") {
            deleteObject(obj);
            clearAction();
        }
        if(action.value === "modify") {
            clearAction()
        }
    }

    function clearMap() {
        map.value.eachLayer(layer => {
            if (!layer._url) {
              map.value.removeLayer(layer);
            }
        });
    }

    function updateMapToAdmin() {
        if(!map.value) return;
        map.value.on('click', (e) => {
            console.log(e.latlng);
        })
    }

    async function updateObject (newObject) {
        if(!object.value) return;
        console.log(object.value, newObject);
        const isForest = object.value.treesAmount;
        const response = await axios.put(`http://localhost:5000/api/${isForest ? "Forest": "Ponds"}/${object.value.id}`, newObject );
    }

    const objectsWithReports = computed(() => {
        return objects.value.filter((obj) => obj.issues && obj.issues.length && obj.issues.some((issue) => !issue.isResolved))
    })

    const objectsWithArchivedReports = computed(() => {
        return objects.value.filter((obj) => obj.issues && obj.issues.length && obj.issues.some((issue) => issue.isResolved))
    })

    async function resolveIssue(issue, isAccepted) {
        try {
            const response = await axios.put(`http://localhost:5000/api/Issues/${issue.id}/resolve`, { isAccepted });
            if (response.status === 200 || response.status === 204) {
                issue.isResolved = true;
                issue.isAccepted = isAccepted;
                renderObjectsOnMap();
            }
        } catch (e) {
            console.error("Failed to resolve issue:", e);
        }
    }

    async function reopenIssue(issue) {
        try {
            const response = await axios.put(`http://localhost:5000/api/Issues/${issue.id}/reopen`);
            if (response.status === 200 || response.status === 204) {
                issue.isResolved = false;
                issue.isAccepted = false;
                renderObjectsOnMap();
            }
        } catch (e) {
            console.error("Failed to reopen issue:", e);
        }
    }

    return {
        map,
        show,
        object,
        isForests,
        isPonds,
        searchValue,
        ecoFilters,
        critFilters,
        objects,
        searchSuggests,
        fetchData,
        toggleShow,
        showObject,
        setObject,
        clearMap,
        updateMapToAdmin,
        updateObject,
        objectsWithReports,
        objectsWithArchivedReports,
        resolveIssue,
        reopenIssue,
    };
});
