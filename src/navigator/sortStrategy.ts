export default { 
    'cat_old_to_new': (a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if(aTitle === 'pinned'){
            return -1;
        }else if(bTitle === 'pinned'){
            return 1;
        }if(a.lastchangeAt > b.lastchangeAt){
            return 1;
        }else if(a.lastchangeAt < b.lastchangeAt){
            return -1;
        }else{
            return 0;
        }
    },
    'cat_new_to_old': (a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if(aTitle === 'pinned'){
            return -1;
        }else if(bTitle === 'pinned'){
            return 1;
        }if(a.lastchangeAt > b.lastchangeAt){
            return -1;
        }else if(a.lastchangeAt < b.lastchangeAt){
            return 1;
        }else{
            return 0;
        }
    },
    'cat_a_to_z': (a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if(aTitle === 'pinned'){
            return -1;
        }else if(bTitle === 'pinned'){
            return 1;
        }else if(aTitle > bTitle){
            return 1;
        }else if(aTitle < bTitle){
            return -1;
        }else{
            return 0;
        }
    },
    'cat_z_to_a': (a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if(aTitle === 'pinned'){
            return -1;
        }else if(bTitle === 'pinned'){
            return 1;
        }else if(aTitle > bTitle){
            return -1;
        }else if(aTitle < bTitle){
            return 1;
        }else{
            return 0;
        }
    },
}
