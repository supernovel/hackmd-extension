<template lang="pug">
.custom-nav-menu
    template(v-if="!loading")
        .search-bar
            input.search-input(
                type="text", 
                v-model="filterText", 
                placeholder="Search documents"
            )
        TreeView(:items="sortedItems", :filter="filter")
    .loading(v-else)
        i.fa.fa-refresh.fa-spin.fa-fw

</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import * as cookies from '@/navigator/cookies';
import SORT_STRATEGY from '@/navigator/sortStrategy';
import { TreeView } from '@/navigator/TreeView';

const TEAM_PATH_REGEXP = /\/team\/([^\/]+)/;

export default Vue.extend({
    components: {
        TreeView
    },
    props: {
        team: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            $_CustomMenu_request_timestamp: Date.now(),
            sortStrategy:
                cookies.get('sectionsSortStrategy') || 'cat_new_to_old',
            loading: false,
            filterText: null,
            rawItems: []
        };
    },
    created() {
        this.initialize();
    },
    computed: {
        endpoint() {
            return `https://hackmd.io/api/overview${
                this.team ? `/team/${this.team}` : ''
            }`;
        },
        filter() {
            const { filterText } = this;

            if (filterText && filterText.length) {
                return item => {
                    const name = item.name.toLowerCase();
                    return name.indexOf(filterText.toLowerCase()) !== -1;
                };
            } else {
                return null;
            }
        },
        items() {
            let items = {};

            this.rawItems.forEach(item => {
                const tags = item.tags || [];
                let sectionName = tags[0] || 'Untagged';

                const lastchangeAt = new Date(item.lastchangeAt);

                if (item.pinned === true) {
                    sectionName = 'Pinned';
                }

                if (items[sectionName] == null) {
                    items[sectionName] = {
                        lastchangeAt,
                        children: []
                    };
                } else {
                    if (lastchangeAt > items[sectionName].lastchangeAt) {
                        items[sectionName].lastchangeAt = lastchangeAt;
                    }
                }

                items[sectionName].children.push({
                    ...item,
                    id: item.id,
                    name: item.title,
                    link: `https://hackmd.io/${item.id}`
                });
            });

            return items;
        },
        sortedItems() {
            return Object.keys(this.items)
                .map((title, index) => {
                    const section = this.items[title];

                    return {
                        id: index,
                        name: title,
                        ...section
                    };
                })
                .sort(SORT_STRATEGY[this.sortStrategy]);
        }
    },
    methods: {
        async initialize() {
            this.loading = true;

            try {
                await this.getListByApi();
            } catch (error) {}

            this.loading = false;
        },
        async getListByApi() {
            const requestTimestamp = Date.now();

            this.$_CustomMenu_request_timestamp = requestTimestamp;

            const { data: rawItems } = await axios.get(this.endpoint);

            if (requestTimestamp < this.$_CustomMenu_request_timestamp) {
                console.debug('past request response.');
            } else {
                this.rawItems = rawItems;
            }
        }
    },
    watch: {
        team(value) {
            this.initialize();
        }
    }
});
</script>

<style lang="scss" scoped>
$font-color: rgba(0, 0, 0, 0.87);

.custom-nav-menu {
    height: 100%;
    overflow: auto;

    padding: 10px 20px;

    font-size: 14px;
    color: $font-color;

    .search-bar{
        display: flex;
        position: relative;
        margin-bottom: 1em;

        .search-input{
            width: 100%;
            border: none;
            padding: 0.35em 0.5em;
            height: 2.5em;
            border-radius: 5px;
            outline: none;
            background-color: rgba(0, 0, 0, 0.1);

            &:focus{
                border: 1px solid rgba(0, 0, 0, 0.6);
                background-color: white;
            }
        }
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 100%;

        i.fa.fa-spin {
            font-size: 2rem;
        }
    }

    * {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
    }
}
</style>
