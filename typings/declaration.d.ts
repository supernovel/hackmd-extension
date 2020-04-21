// declaration.d.ts
declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}
