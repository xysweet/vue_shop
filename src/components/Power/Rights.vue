<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权利列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="rightList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="等级">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.level==0">等级一</el-tag>
                        <el-tag type="primary" v-if="scope.level==1">等级er</el-tag>
                        <el-tag type="warn" v-else>等级san</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "Rights",
        data() {
            return {
                rightList: []
            }
        },
        created() {
            this.getRightList();
        },
        methods: {
            async getRightList() {
                const {data: res} = await this.$http.get('rights/list');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.rightList = res.data;

            }
        }
    }
</script>

<style scoped>

</style>