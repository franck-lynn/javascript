<template>
    <tbody v-for="(item, index) in items" :key="index">
        <!-- 需要进行跨列设置, 如果数据里面有 contracts_no 属性 -->
        <tr v-if="item.contract_no" class="contract-info">
            <td :colspan="colspan"> {{item.contract_no}} </td>
        </tr>
        <tr v-for="(row, index) in item.details" :key="index">
            <th v-for="(cell, index) in row" :key="index" 
              :class="index" :contenteditable="index === 'delivering' ? true: false"> {{cell}}</th>
        </tr>
    </tbody>
</template>

<script>
    import { defineComponent,  } from 'vue'
    
    export default defineComponent({
        name: 'table-body',
        props: {
            tbody: {
                type: Array,
                default: () => []
            }
        },
        setup(props) {
            // 对传过来的 tbody 进行处理, 没有 details 属性就构造一个
            const items = JSON.stringify(props.tbody).indexOf('contract_no') !== -1 ? props.tbody : [{ details: props.tbody }]
            // 如果是 delivering, 且 stocks > 0 才可以变成可编辑状态,
            // contenteditable 属性还要实现禁止换行, 左右, 上下, 回车, 删除等键的功能
            
           
            
            return { items }
        }
    })
</script>

<style lang="scss" scoped>

</style>