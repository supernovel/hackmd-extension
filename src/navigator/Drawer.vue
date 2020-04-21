<template lang="pug">
.drawer-wrapper
    transition(name='drawer' appear)
        aside.drawer.left(v-show="opened" v-click-outside="vcoConfig")
            .drawer-content
                slot
    .drawer-button.voc-drawer-exclude(@click="toggle()")
        .arrow.voc-drawer-exclude(:class="arrowDirection")
</template>

<script lang="ts">
import Vue from 'vue';
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside);

export default Vue.extend({
    data(){
        return {
            opened: false,
            vcoConfig: {
                handler: this["hide"],
                middleware: this["vocFilter"],
                events: ['click'],
                isActive: true
            }
        }
    },
    computed: {
        arrowDirection(){
            return this.opened ? 'left' : 'right'; 
        }
    },
    methods: {
        toggle(){
            this.opened = !this.opened;
        },
        hide(){
            this.opened = false;
        },
        vocFilter (event) {
            return !event.target.classList.contains('voc-drawer-exclude');
        }
    }
});
</script>

<style lang="scss" scoped>
.drawer-wrapper{
    position: fixed;
    top: 0px;
    z-index: 10000;

    width: 100vw;
    height: 100vh;

    background-color: transparent;
        
    pointer-events: none;

    .drawer{
        position: absolute;
        top: 0px;

        box-sizing: border-box;
        
        width: 65%;
        max-width: 400px;
        height: 100%;
        
        padding: 8px;
        margin: 0px;
        background-color: transparent;
        
        pointer-events: none;

        &.right{
            right: 0px;

            .drawer-content{
                box-shadow: -1px 1px 8px rgba(0, 0, 0, 0.15);
            }
        }
        
        &.left{
            left: 0px;

            .drawer-content{
                box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
            }
        }

        .drawer-content{
            display: flex;
            flex-flow: column;
            width: 100%;
            height: 100%;

            background-color: white;
            border: none;
            border-radius: 5px;

            pointer-events: all;
        }

        .drawer-button{
            width: 2rem;
            height: 2rem;

            pointer-events: all;
            cursor: pointer;

            background-color: black;
        }

        &.drawer-enter-active, &.drawer-leave-active {
            transition: transform 0.45s cubic-bezier(0, 0, 0.3, 1);
        }
        
        &.drawer-enter, &.drawer-leave-to {
            &.right{
                transform: translateX(100%);
            }
            
            &.left{
                transform: translateX(-100%);
            }
        }

        &.drawer-enter-to, &.drawer-leave {
            transform: translate3d(0, 0, 0);
        }
    }

    .drawer-button{
        position: absolute;
        top: 50%;
        z-index: 1;

        width: 2rem;
        height: 2.5rem;

        background-color: rgba(0, 0, 0, 0.15);
        box-shadow: 2px 0px 6px rgba(255, 255, 255, 0.50);

        pointer-events: all;
        cursor: pointer;

        .arrow {
            position: absolute;
            top: 50%;
            width: 1.5rem;
            height: 1.5rem;
            background: transparent;
            border-top: 0.5rem solid white;
            border-right: 0.5rem solid white;
            box-shadow: 0 0 0 lightgray;
            transition: all 200ms ease;
            
            &.left {
                right: 0;
                transform: translate3d(0,-50%,0) rotate(-135deg);
            }

            &.right {
                left: 0;
                transform: translate3d(0,-50%,0) rotate(45deg);
            }
        }
     
        &:hover {
            .arrow {
                border-color: orange;
            }
        }
    }
}
</style>