import { useFetch } from "@/composables/useFetch";
import { defineStore } from "pinia";
import forests from '@/api/mock/forests.mock.json'

export const useSearchStore = defineStore('searchStore', {
    state: () => ({ 
        searchValue: '',
        criticity: null,
        ecosystem: null,
        results: forests,
    }),
    actions: {
        async search() {
            if(this.searchValue) {

            } else {
                const { get, responseData } = useFetch();
                await get('http://192.168.234.128:5000/api/Forest')
                console.log(responseData);
                this.results = responseData;
            }
        }
    }
})