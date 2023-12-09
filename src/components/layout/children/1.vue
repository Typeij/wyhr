<template>
    <el-tree :data="treeData" :props="treeProps"></el-tree>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElTree } from 'element-plus';

export default {
    components: {
        ElTree
    },
    setup() {
        const treeData = ref([]);
        const treeProps = {
            label: 'powerName',
            children: 'children'
        };

        onMounted(() => {
            treeData.value = formatTreeData(data);
        });

        function formatTreeData(data) {
            return data.map(item => {
                if (item.children && item.children.length > 0) {
                    item.children = formatTreeData(item.children);
                }
                return item;
            });
        }
    }
};
</script>
