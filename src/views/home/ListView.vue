<template>
    <div class="list-view">
        <v-card rounded v-for="index of [1,2,3]">
        <v-card-title>
            <h2>Lake Name {{ index }}</h2>
        </v-card-title>
        <v-card-text>
            <p>статус</p>
            <p>статус</p>
            <p>статус</p>
        </v-card-text>
    </v-card>
    </div>
</template>
<style scoped lang="scss">
.list-view {
    @include centered-flex;
    align-items: start;
    width: 80%;
    flex-direction: column;
    gap: 1em;
    .v-card {
        @include shadow(4px);
        width: 100%;
    }
}
</style>