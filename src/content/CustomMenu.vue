<template lang="pug">
.custom-menu.sidenav-menu
    ul
        li(v-for="item in sortedSections")
            a.title(@click="scrollTo(item.title)")
                span {{ "( " + item.list.length + " )"}}
                | {{ item.title }}

</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import scrollTo from 'animated-scroll-to';
import * as cookies from '@/content/cookies';
import { findElement } from '@/content/util';
import SORT_STRATEGY from '@/content/sortStrategy';

const ELEMENT_CHECK_INTERVAL = 1000;
const SCROLL_SPEED = 500;
const SCROLL_OFFSET = 500;
const MAX_SCROLL_LIMIT = 20;
const CONTAINER = Symbol('$_CustomMenu_container');

export default Vue.extend({
    props: {
        container: {
            type: String,
            default: '#hackmd-app div.overview-component'
        },
        endpoint: {
            type: String,
            default: 'https://hackmd.io/api/overview/team/lucentblock'
        }
    },
    data(){
        return {
            [CONTAINER]: document,
            sortStrategy: cookies.get('sectionsSortStrategy') || 'cat_new_to_old',
            sections: []
        };
    },
    async created(){
        try{
            this[CONTAINER] = await findElement({
                selector: this.container
            })
        }catch(error){}

        try{
            await this.getListByApi();
        }catch(error){}
    },
    computed: {
        sortedSections(){
            return Object.keys(this.sections).map((title) => {
                const section = this.sections[title];

                return {
                    title,
                    ...section
                };
            }).sort(SORT_STRATEGY[this.sortStrategy]);
        }
    },
    methods: {
        scrollTo(title: string, direction: number = 1){
            let count = 1;
            const scrollToElement = async () => {
                const [ element ] = (
                    [...(this[CONTAINER] as Element)
                    .querySelectorAll('.list-section > h1 > span')]
                    .filter((element) => {
                        return element.textContent.indexOf(title) !== -1;
                    })
                );

                if(element){
                    await scrollTo(element, {
                        cancelOnUserAction: false,
                        speed: SCROLL_SPEED
                    });
                }else if(count < MAX_SCROLL_LIMIT){
                    count++;

                    const scrollY = window.scrollY + direction * SCROLL_OFFSET;

                    await scrollTo(scrollY, {
                        cancelOnUserAction: false,
                        speed: SCROLL_SPEED
                    });

                    await scrollToElement();
                }
            }

            scrollToElement();
        },
        async getListByApi(){
            const { data: list } = await axios.get(this.endpoint);

            let sections = {};

            list.forEach((item) => {
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

            this.sections = sections;
            console.log(sections);
        }
    }
});
</script>

<style lang="scss" scoped>
$container-border-color: #8a8a8a;

.custom-menu{
    height: calc(100% - 360px);
    overflow: auto;

    border-top: $container-border-color solid 1px;
    border-bottom: $container-border-color solid 1px;

    & > ul > li > a.title > span {
        margin-right: 0.5rem;
    }
}
</style>