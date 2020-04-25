<template lang="pug">
ul.tree-view
    .tree-view-toolbar
        .tree-view-button(@click="openAll()")
            FeatherIcon(
                name="plus-square", 
                base-class="tree-view-button-icon", 
            )
        .tree-view-button(@click="closeAll()")
            FeatherIcon(
                name="minus-square", 
                base-class="tree-view-button-icon", 
            )
    TreeViewNode(
        v-for="item in items", 
        :key="item.id", 
        :item="item",
        :excludeIds="excludeIds",
        :enabledFilter="enabledFilter"
    )
</template>

<script>
import Vue from 'vue';
import FeatherIcon from 'vue-icon/lib/vue-feather.esm'
import TreeViewNode from './TreeViewNode';
import eventBus from './eventBus';

export default Vue.extend({
    name: 'TreeView',
    components: {
        TreeViewNode,
        FeatherIcon
    },
    props: {
        items: {
            type: Array,
            default: () => []
        },
        filter: {
            type: Function
        }
    },
    computed: {
        enabledFilter() {
            return typeof this.filter === 'function';
        },
        excludeIds() {
            const excludeIds = {};

            if (!this.enabledFilter) {
                return excludeIds;
            }

            const { filter, items } = this;
            const queue = [...items];
            const visit = {};

            while (queue.length) {
                const item = queue[queue.length - 1];
                const { id, children = [] } = item;

                if (!visit[id]) {
                    if (children && children.length) {
                        queue.push(...children);
                    } else {
                        excludeIds[id] = !filter(item);
                        queue.pop();
                    }

                    visit[id] = true;
                } else {
                    if (children && children.length) {
                        let exclude = true;

                        children.forEach(({ id: childrenId }) => {
                            exclude = exclude && excludeIds[childrenId];
                        });

                        excludeIds[id] = exclude;
                    }

                    queue.pop();
                }
            }

            return excludeIds;
        }
    },
    methods: {
        openAll(){
            eventBus.$emit('openAll');
        },
        closeAll(){
            eventBus.$emit('closeAll');
        }
    }
});
</script>

<style lang="scss" scoped>
.tree-view /deep/ {
    list-style: none;
    padding: 0;

    & > .tree-view-node > .tree-view-node-content {
        font-size: 1.2em;
    }

    .tree-view-toolbar{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        
        padding: 0 0.5em;
        margin-bottom: 0.25em;
        
        .tree-view-button{
            display: flex;
            align-items: center;
            
            flex: 0 0 1.2em;
            margin-left: 0.5em;

            .tree-view-button-icon{
                width: 100%;
                height: 100%;
            }

            &:hover{
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }

    * {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
    }
}
</style>
