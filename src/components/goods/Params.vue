<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert show-icon type="warning" title="注意：只允许为第三级分类设置相关参数" :closable="false"></el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <el-cascader
                            expand-trigger="hover"
                            :options="cateList"
                            :props="cateProp"
                            v-model="selectCateKeys"
                            :show-all-levels="false"
                            @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" @click="dialogVisible=true" :disabled="isBtnDisabled" size="mini">添加参数
                    </el-button>
                    <el-table :data="manyData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                        :key="i"
                                        v-for="(tag,i) in scope.row.attr_vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm"
                                        @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>

                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope>
                                <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
                                <el-button icon="el-icon-delete" type="danger" size="mini"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" @click="dialogVisible=true"
                               :disabled="isBtnDisabled" size="mini">添加参数
                    </el-button>
                    <el-table :data="onlyData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                        :key="i"
                                        v-for="(tag,i) in scope.row.attr_vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope>
                                <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
                                <el-button icon="el-icon-delete" type="danger" size="mini"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog
                title="添加动态参数"
                :visible.sync="dialogVisible"
                width="50%"
                @close="closeAddCategoryForm">
            <el-form :model="addForm" :rules="rules" ref="addFormRef">
                <el-form-item label="动态参数" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategorySubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                cateList: [],
                cateProp: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                selectCateKeys: [],
                activeName: 'many',
                manyData: [],
                onlyData: [],
                dialogVisible: false,
                addForm: {
                    'attr_name': ''
                },
                rules: {
                    attr_name: [
                        {required: true, message: '请输入', trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.cateList = res.data;
            },
            handleChange() {
                this.getParams();
            },
            async getParams() {
                if (this.selectCateKeys.length != 3) {
                    this.selectCateKeys = [];
                    return;
                }
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes?sel=${this.activeName}`)
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                res.data.forEach(item=>{
                   item.attr_vals=item.attr_vals? item.attr_vals.split(' '):[];

                   item.inputVisible=false;
                   item.inputValue='';
                });

                if (this.activeName == 'many') {
                    this.manyData = res.data;
                } else {
                    this.onlyData = res.data
                }
            },
            handleTabClick() {
                this.getParams();
            },
            closeAddCategoryForm() {
                this.$refs.addFormRef.resetFields();
            },
            addCategorySubmit() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return;
                    this.$http.post(`categories/${this.cateId}/attributes`,{
                        'attr_name':this.addForm.attr_name,
                        'attr_sel':this.activeName
                    });
                    this.getParams();
                    this.dialogVisible = false;
                });

            },
            handleClose(tag){
                console.log(tag)
            },
           async handleInputConfirm(row){
                if(row.inputValue.trim().length==0){
                    row.inputValue='';
                    row.inputVisible=true;
                    return;
                }else{
                    row.attr_vals.push(row.inputValue.trim());
                    const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                        attr_vals:row.attr_vals.join(' '),
                        attr_name:row.attr_name,
                        attr_sel:row.attr_sel
                    });
                    if(res.meta.status!==200){
                        return this.$message.error(res.meta.msg);
                    }
                    this.$message.success(res.meta.msg);
                    row.inputValue='';
                    row.inputVisible=false;
                }
            },
            showInput(row) {
                row.inputVisible = true;
                // this.$nextTick(_ => {
                //     this.$refs.saveTagInput.$refs.input.focus();
                // });
            },
        },
        computed: {
            isBtnDisabled() {
                if (this.selectCateKeys.length == 3) {
                    return false;
                }else{
                    return true;
                }
            },
            cateId() {
                if (this.selectCateKeys.length !== 3) {
                    return null;
                }else{
                    return this.selectCateKeys[2];
                }
            }
        }
    }
</script>

<style scoped>
    .cat_opt {
        padding: 10px;
    }
    .el-tag{
        margin: 5px;
    }
</style>