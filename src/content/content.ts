import Vue from 'vue';
import VueRx from 'vue-rx';
import { browser } from 'webextension-polyfill-ts';
import CustomMenu from '@/content/CustomMenu.vue';

const SIDEBAR_SELECTOR = '#sidebar div.sidenav-menu';

Vue.use(VueRx);

(() => {
    const sidebar = document.querySelector(SIDEBAR_SELECTOR);

    if(sidebar != null){
        const div = document.createElement('div');
        sidebar.after(div);

        const customMenu = new CustomMenu();
        customMenu.$mount(div);
    }
})();

