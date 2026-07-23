import { defineStore } from "pinia";

export const useObjectDetails = defineStore('objectDetails', {
    state: () => ({ map: null, show: false, object: {}, objects: [] }),
    actions: {
        toggleShow() {
            this.show = !this.show
        },
        showObject(object) {
            this.object = object;
            this.show = true;
        },
        setObjects (array) {
            this.objects = array;
        },
        clearMap () {
            this.map.eachLayer(layer => {
                if (!layer._url) {
                  this.map.removeLayer(layer);
                }
              });
        },
        showForests () {
            this.clearMap();
            this.objects.forEach((o) => {
                if(o.object.fireIncidentsAmount) {
                    o.circle.addTo(this.map);
                }
            })
        },
        showPonds () {
            this.clearMap();
            this.objects.forEach((o) => {
                if(!o.object.fireIncidentsAmount) {
                    o.circle.addTo(this.map);
                }
            })
        },
        setMap(map) {
            this.map = map;
        },
        addToIssue(o) {
            console.log(this.object)
            this.object.issues = [o]
        },
        search(str) {
            this.clearMap()
            this.objects.forEach((o) => {
                if(o.object.name.includes(str) || o.object.district.includes(str)) {
                    o.circle.addTo(this.map);
                }
            })
        }
}
});