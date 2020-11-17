<template>
    <thead>
        <tr>
            <th v-for="(title, index) in thead" :key="index"> {{title}} </th>
        </tr>
    </thead>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        // 表头文件
        name: 'table-head',
        props: {
            thead: {
                type: Object,
                default: () => {/*  */}
            }
        },
        setup() {
            return {}
        }
    })
</script>

<style lang="scss" scoped>

</style>