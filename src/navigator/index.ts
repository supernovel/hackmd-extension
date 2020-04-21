import Vue from 'vue';
import VueRx from 'vue-rx';
import Navigator from '@/navigator/Navigator.vue';
import Drawer from '@/navigator/Drawer.vue';

const TEAM_PATH_REGEXP = /\/team\/([^\/]+)/;

Vue.use(VueRx);

const mainView = document.querySelector('#hackmd-app');
const contentView = document.querySelector('.row.ui-content');
const container = document.createElement('div');
const vm = new Vue({
    data() {
        return {
            team: (TEAM_PATH_REGEXP.exec(location.pathname) || [])[1] || ''
        };
    },
    methods: {
        changeTeam(team) {
            this.team = team;
        }
    },
    render(createElement) {
        return createElement(Drawer, {}, [
            createElement(Navigator, {
                props: {
                    team: this.team
                },
                on: {
                    'change.team': this.changeTeam
                }
            })
        ]);
    }
});

if (mainView != null) {
    mainView.after(container);
    vm.$mount(container);
} else if (contentView != null) {
    contentView.after(container);
    vm.$mount(container);
}
