<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/goods'}">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    show-icon/>
            <el-steps :active="activeIndex-0" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="addBeforeLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addForm.goods_cat"
                                    :options="options"
                                    :show-all-levels="false"
                                    :props="props"
                                    expand-trigger="hover"
                                    @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item,i) in manyData" :key="i">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="it" v-for="(it,i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                                class="upload-demo"
                                :action="uploadUrl"
                                :on-preview="handlePreview"
                                :headers="header"
                                :on-remove="handleRemove"
                                :on-success="onSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor
                                v-model="addForm.goods_introduce"
                        />
                        <el-button type="primary" @click="formSubmit" style="margin-top: 20px">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
                title="图片预览"
                :visible.sync="dialogVisible"
                width="30%">
            <img :src="imgUrl" alt="" width="100%">
        </el-dialog>
    </div>
</template>

<script>
    import {deepCopy} from "../../Utils/utils";

    export default {
        name: "Add",
        data() {
            return {
                activeIndex: '0',
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                    attr:[],
                },
                addFormRules: {
                    goods_name: [{
                        required: true, message: '必填', trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true, message: '必填', trigger: 'blur'
                    }],
                    goods_number: [{
                        required: true, message: '必填', trigger: 'blur'
                    }],
                    goods_price: [{
                        required: true, message: '必填', trigger: 'blur'
                    }],
                    goods_cat: [{
                        required: true, message: '必填', trigger: 'blur'
                    }]
                },
                options: [],
                props: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                manyData: [],
                uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
                header: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                imgUrl: '',
                dialogVisible: false
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = [];
                }
            },
            async getCateList() {
                const {data: res} = await this.$http.get('categories');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.options = res.data;
            },
            addBeforeLeave(activeName, oldActiveName) {
                if (this.addForm.goods_cat.length !== 3 && oldActiveName == 0) {
                    this.$message.error('请选择商品分类');
                    return false;
                }
            },
            async tabClick() {
                if (this.activeIndex == '1') {
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {sel: 'many'}
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error(res.meta.msg);
                    }
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
                    });
                    this.manyData = res.data;
                }
            },
            handlePreview(file) {
                console.log(file)
                this.imgUrl = file.response.data.url;
                this.dialogVisible = true;
            },
            handleRemove(file) {
                console.log(file)
                const pic = {pic: file.response.data.tmp_path};
                const i = this.addForm.pics.findIndex(x => x.pic == pic);
                this.addForm.pics.splice(i, 1);
                console.log(this.addForm)
            },
            onSuccess(response) {
                const pic = {pic: response.data.tmp_path};
                this.addForm.pics.push(pic);
                console.log(this.addForm);
            },
            formSubmit() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return;
                    this.manyData.forEach(item=>{
                        const many={
                            attr_vals:item.attr_vals,
                            attr_id:item.attr_id,
                        }
                        this.addForm.attr.push(many);
                    })
                    //深拷贝
                    //1.报错原因:如果在JSON.stringify中传入一个循环引用的对象，那么会直接报错
                    // const form = JSON.parse(JSON.stringify(this.addForm));
                    // form.goods_cat = JSON.parse(form).goods_cat.join(',');
                    //2.
                    let form = deepCopy(this.addForm);
                    form.goods_cat = form.goods_cat.join(',');
                    console.log(form);
                    //3.使用lodash .cloneDeep()

                });
            }
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length == 3) {
                    return this.addForm.goods_cat[2];
                }
                return null;
            }
        }
    }
</script>

<style scoped>
    .el-steps {
        margin: 15px 0;
    }

    .el-steps .el-step__title {
        font-size: 14px;
    }
</style>