<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="setCategoryDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table
                    class="tree-table"
                    :data="categoryList"
                    :columns="columns"
                    show-index
                    index-text="#"
                    border
                    :show-row-type="false"
                    :selection-type="false"
                    :expand-type="false">
                <template slot="isOk" slot-scope="scope">
                    <i style="color: lightblue" :class="scope.row.cat_deleted?'el-icon-success':'el-icon-error'"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="wary" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini" @click="scope.row" icon="el-icon-edit"></el-button>
                    <el-button type="success" size="mini" icon="el-icon-delete"></el-button>
                </template>
            </tree-table>
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum"
                           :page-sizes="[10,20,30,40]"
                           :page-size="queryInfo.pagesize"
                           layout="total,sizes,prev,pager,next,jumper"
                           :total="total">

            </el-pagination>
        </el-card>
        <el-dialog
                title="添加分类"
                :visible.sync="dialogVisible"
                width="50%"
                @close="closeAddCategoryForm"
               >
            <el-form :model="addCategoryForm" ref="cateForm" :rules="rules">
                <el-form-item label="名称" prop="cat_name">
                    <el-input v-model="addCategoryForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                            expand-trigger="hover"
                            v-model="selectKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange"
                            clearable
                            change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "category",
        data() {
            return {
                categoryList: [],
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    type: 'template',
                    template: 'isOk'
                }, {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                }, {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }],
                dialogVisible: false,
                addCategoryForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                rules: {
                    cat_name: [{
                        required: true, message: 'required', trigger: 'blur'
                    }]
                },
                parentCateList: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectKeys: []
            }
        },
        created() {
            this.getCategoryList();
        },
        methods: {
            async getCategoryList() {
                const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.categoryList = res.data.result;
                this.total = res.data.total;
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCategoryList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCategoryList();
            },
            setCategoryDialog() {
                this.getParentCateList();
                this.dialogVisible = true;
            },
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.parentCateList = res.data;
            },
            parentCateChange() {
                if (this.selectKeys.length > 0) {
                    this.addCategoryForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
                    this.addCategoryForm.cat_level = this.selectKeys.length;
                    return;
                } else {
                    this.addCategoryForm.cat_level = 0;
                    this.addCategoryForm.cat_level = 0;
                }
            },
            addCate() {
                this.$refs.cateForm.validate(async valid=>{
                    if(!valid){
                        return;
                    }
                    const {data:res}=await this.$http.post('categories',this.addCategoryForm);
                    if(res.meta.status!==201){
                        return this.$message.error( res.meta.msg);
                    }
                    this.$message.success(res.meta.msg);
                    this.getCategoryList();
                    this.dialogVisible=false;
                });
            },
            closeAddCategoryForm(){
                this.$refs.cateForm.resetFields();
                this.selectKeys=[];
                this.addCategoryForm={};
            }
        },

    }
</script>

<style scoped>
    .tree-table {
        margin-top: 10px;
    }
</style>