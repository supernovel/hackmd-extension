<template lang="pug">
li.tree-view-node(v-if="!isHidden")
  .tree-view-node-content(@click="toggle")
    FeatherIcon(:name="icon" base-class="tree-view-node-icon")
    template(v-if="hasLink")
      a(:href="item.link") {{ item.name }}
    template(v-else)
      span {{ item.name }}
  ul.tree-view-node-children(v-if="isExpaneded")
    TreeViewNode(
      v-for="childrenItem in children", 
      :key="childrenItem.id", 
      :item="childrenItem",
      :excludeIds="excludeIds",
      :enabledFilter="enabledFilter"
    )
</template>

<script lang="ts">
import Vue from 'vue';
import FeatherIcon from 'vue-icon/lib/vue-feather.esm'
import eventBus from './eventBus';

export default Vue.extend({
    name: 'TreeViewNode',
    components: {
        FeatherIcon
    },
    props: {
        item: {
            type: Object,
            default: () => null
        },
        excludeIds: {
            type: Object,
            default: () => {
                return {};
            }
        },
        enabledFilter: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            expanded: false
        };
    },
    mounted(){
        if(this.hasChildren){
            eventBus.$on('openAll', this.open);
            eventBus.$on('closeAll', this.close);
            eventBus.$on(`open.${this.item.id}`, this.open);
            eventBus.$on(`close.${this.item.id}`, this.open);
        }
    },
    beforeDestroy(){
        eventBus.$off('openAll', this.open);
        eventBus.$off('closeAll', this.open);
        eventBus.$off(`open.${this.item.id}`, this.open);
        eventBus.$off(`close.${this.item.id}`, this.open);
    },
    computed: {
        hasChildren() {
            return (this.item.children || []).length;
        },
        hasLink() {
            return this.item.link;
        },
        isExpaneded() {
            return this.hasChildren && this.expanded;
        },
        isHidden() {
            return this.excludeIds[this.item.id] === true;
        },
        children() {
            return this.item.children || [];
        },
        icon(){
            let { icon } = this.item;
            
            if(icon){
                return icon;
            }else if(this.hasChildren){
                return this.expanded ? 'folder-minus' : 'folder-plus';
            }else{
                return 'file-text';
            }
        }
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
        open(){
            this.expanded = true;
        },
        close(){
            this.expanded = false;
        }
    },
    watch: {
        enabledFilter(value) {
            if (value) {
                this.$_TreeViewNode_prevExpanedState = this.expanded;
                this.expanded = true;
            } else {
                this.expanded = this.$_TreeViewNode_prevExpanedState;
            }
        }
    }
});
</script>

<style lang="scss" scoped>
.tree-view-node{
    .tree-view-node-content{
        display: flex;
        align-items: center;
        min-height: 2em;
        padding: 0 0.5em;
        color: rgba(0,0,0,.87);
        font-size: 1em;

        .tree-view-node-icon{
            flex: 0 0 1em;
            margin-right: 0.5em;
        }

        &:hover{
            background-color: rgba(0, 0, 0, 0.1);
        }
    }

    .tree-view-node-children{
        list-style: none;
        padding-left: 1em;
    }
}
</style>
