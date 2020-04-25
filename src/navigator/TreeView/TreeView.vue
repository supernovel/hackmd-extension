<template lang="pug">
ul.tree-view
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
import TreeViewNode from './TreeViewNode';

export default Vue.extend({
    name: 'TreeView',
    components: {
        TreeViewNode
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
            if (!this.enabledFilter) {
                return excludeIds;
            }

            const excludeIds = {};
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
    }
});
</script>

<style lang="scss" scoped>
.tree-view /deep/{ 
    list-style: none;
    padding: 0;

    & > .tree-view-node > .tree-view-node-content{
        font-size: 1.2em;
    }

    * {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
    }
}
</style>
