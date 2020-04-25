export default {
    cat_old_to_new(a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === 'pinned') {
            return -1;
        } else if (bName === 'pinned') {
            return 1;
        }
        if (a.lastchangeAt > b.lastchangeAt) {
            return 1;
        } else if (a.lastchangeAt < b.lastchangeAt) {
            return -1;
        } else {
            return 0;
        }
    },
    cat_new_to_old(a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === 'pinned') {
            return -1;
        } else if (bName === 'pinned') {
            return 1;
        }
        if (a.lastchangeAt > b.lastchangeAt) {
            return -1;
        } else if (a.lastchangeAt < b.lastchangeAt) {
            return 1;
        } else {
            return 0;
        }
    },
    cat_a_to_z(a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === 'pinned') {
            return -1;
        } else if (bName === 'pinned') {
            return 1;
        } else if (aName > bName) {
            return 1;
        } else if (aName < bName) {
            return -1;
        } else {
            return 0;
        }
    },
    cat_z_to_a(a, b) {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === 'pinned') {
            return -1;
        } else if (bName === 'pinned') {
            return 1;
        } else if (aName > bName) {
            return -1;
        } else if (aName < bName) {
            return 1;
        } else {
            return 0;
        }
    }
};
