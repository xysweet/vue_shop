<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query"
                              @clear="getGoodsList" clearable>
                        <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table stripe border :data="goodsList">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" size="mini" type="primary"></el-button>
                        <el-button icon="el-icon-delete" size="mini" type="warning"
                                   @click="deleteGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="queryInfo.pagesize"
                    layout="sizes, prev, pager, next,jumper,total"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                goodsList: [],
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0
            }
        },
        created() {
            this.getGoodsList();
        },
        methods: {
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.goodsList = res.data.goods;
                this.total = res.data.total;
            },
            handleSizeChange(size) {
                this.queryInfo.pagesize = size;
                this.getGoodsList();
            },
            handleCurrentChange(page) {
                this.queryInfo.pagenum = page;
                this.getGoodsList();
            },
            deleteGoods(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(async () => {
                    const {data:res}=await this.$http.delete(`goods/${id}`);
                    if(res.meta.status!==200){
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getGoodsList();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

        }
    }
</script>

<style scoped>

</style>