<template lang="pug">
li.navigator-sub-item
    a.title(:href="documentLink") {{ item.title }}
    
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        item: {
            type: Object,
            default(){
                return { title: 'Unknown' };
            }
        },
    },
    computed: {
        documentLink() {
            return `https://hackmd.io/${this.item.id}`;
        },
    },
});
</script>

<style lang="scss" scoped>
</style>