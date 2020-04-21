<template lang="pug">
li.navigator-item-container
    .navigator-item-title(@click="toggle()")
        span {{ "( " + section.list.length + " )" }}
        |  {{ section.title }}
    ul.navigator-sub-items(v-if="hasList && expanded")
        NavigatorSubItem(v-for="item in section.list" :item="item")
    
</template>

<script lang="ts">
import Vue from 'vue';
import NavigatorSubItem from '@/navigator/NavigatorSubItem.vue';

export default Vue.extend({
    components: {
        NavigatorSubItem
    },
    props: {
        section: {
            type: Object,
            default(){
                return { title: 'Unknown' };
            }
        },
    },
    data(){
        return {
            expanded: false
        }
    },
    computed: {
        hasList() {
            return this.section.list.length;
        },
    },
    methods: {
        toggle(){
            this.expanded = !this.expanded;
        }
    }
});
</script>

<style lang="scss" scoped>
ul.navigator-sub-items{
    list-style: none;
}
</style>