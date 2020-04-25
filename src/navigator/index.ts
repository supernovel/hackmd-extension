import Vue from 'vue';
import Navigator from '@/navigator/Navigator.vue';
import Drawer from '@/navigator/Drawer.vue';
import { getCurrentTeamName, parseTeamURI } from '@/navigator/util';

const mainView = document.querySelector('#hackmd-app');
const contentView = document.querySelector('.row.ui-content');
const container = document.createElement('div');
const vm = new Vue({
    data() {
        return {
            team: getCurrentTeamName()
        };
    },
    methods: {
        changeTeam(team) {
            this.team = team;
        }
    },
    mounted() {
        this.$_Root_oldPushState = window.history.pushState;
        this.$_Root_oldReplaceState = window.history.replaceState;

        window.history.pushState = (...args) => {
            const [_state, _title, url] = args;
            this.changeTeam(parseTeamURI(url) || getCurrentTeamName());
            this.$_Root_oldPushState.call(window.history, ...args);
        };

        window.history.replaceState = (...args) => {
            const [_state, _title, url] = args;
            this.changeTeam(parseTeamURI(url) || getCurrentTeamName());
            this.$_Root_oldReplaceState.call(window.history, ...args);
        };
    },
    beforeDestroy() {
        window.history.pushState = this.$_Root_oldPushState;
        window.history.replaceState = this.$_Root_oldReplaceState;
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
