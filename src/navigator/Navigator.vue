<template lang="pug">
.custom-nav-menu
    ul.custom-nav-menu-list(v-if="!loading")
        NavigatorItem(v-for="section in sortedSections" :section="section")
    .loading(v-else)
        i.fa.fa-refresh.fa-spin.fa-fw

</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import * as cookies from '@/navigator/cookies';
import SORT_STRATEGY from '@/navigator/sortStrategy';
import NavigatorItem from '@/navigator/NavigatorItem.vue';

const TEAM_PATH_REGEXP = /\/team\/([^\/]+)/;

export default Vue.extend({
    components: {
        NavigatorItem
    },
    props: {
        team: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            $_CustomMenu_request_timestamp: Date.now(),
            sortStrategy: cookies.get('sectionsSortStrategy') || 'cat_new_to_old',
            loading: false,
            items: []
        };
    },
    created(){
        this.initialize();
    },
    mounted(){
        this.$_CustomMenu_oldPushState = window.history.pushState;
        this.$_CustomMenu_oldReplaceState = window.history.replaceState;
        
        window.history.pushState = (...args) => {
            const [ state, title, url ] = args;
            this.$emit('change.team', (TEAM_PATH_REGEXP.exec(url) || [])[1] || '');
            this.$_CustomMenu_oldPushState.call(window.history, ...args);
        }

        window.history.replaceState = (...args) => {
            const [ state, title, url ] = args;
            this.$emit('change.team', (TEAM_PATH_REGEXP.exec(url) || [])[1] || '');
            this.$_CustomMenu_oldReplaceState.call(window.history, ...args);
        }
    },
    beforeDestroy(){
        window.history.pushState = this.$_CustomMenu_oldPushState;
        window.history.replaceState = this.$_CustomMenu_oldReplaceState;
    },
    computed: {
        endpoint(){
            return `https://hackmd.io/api/overview${ this.team ? `/team/${this.team}`: '' }`
        },
        sections(){
            let sections = {};

            this.items.forEach((item) => {
                const tags = item.tags || [];
                let sectionName = tags[0] || 'Untagged';

                const lastchangeAt = new Date(item.lastchangeAt);

                if(item.pinned === true){
                    sectionName = 'Pinned';
                }

                if(sections[sectionName] == null){
                    sections[sectionName] = {
                        lastchangeAt,
                        list: []
                    };
                }else{
                    if(lastchangeAt > sections[sectionName].lastchangeAt){
                        sections[sectionName].lastchangeAt = lastchangeAt;
                    }
                }

                sections[sectionName].list.push(item);
            });

            return sections;
        },
        sortedSections(){
            return Object.keys(this.sections).map((title) => {
                const section = this.sections[title];

                return {
                    title,
                    ...section
                };
            }).sort(SORT_STRATEGY[this.sortStrategy]);
        },
    },
    methods: {
        async initialize() {
            this.loading = true;
            
            try{
                await this.getListByApi();
            }catch(error){}

            this.loading = false;
        },
        async getListByApi(){
            const requestTimestamp = Date.now();
            
            this.$_CustomMenu_request_timestamp = requestTimestamp;

            const { data: items } = await axios.get(this.endpoint);

            if(requestTimestamp < this.$_CustomMenu_request_timestamp){
                console.debug('past request response.');
            }else{
                this.items = items;
            }
        }
    },
    watch: {
        team(value){
            this.initialize();
        }
    }
});
</script>

<style lang="scss" scoped>
$container-border-color: #8a8a8a;

.custom-nav-menu{
    height: 100%;
    overflow: auto;

    padding: 10px 20px;

    border-top: $container-border-color solid 1px;
    border-bottom: $container-border-color solid 1px;

    ul {
        list-style: none;
        
        padding: 0;
    }
}

.loading{
    display: flex;
    align-items: center;
    justify-content: center;

    height: 100%;

    i.fa.fa-spin {
        font-size: 2rem;
    }
}
</style>