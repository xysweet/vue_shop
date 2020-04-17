<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20" type="flex" justify="space-between">
                <el-col :span="12">
                    <el-input placeholder="search" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button @click="getUserList" type="info" slot="append">search</el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
                </el-col>
                <el-dialog
                        title="添加用户"
                        :visible.sync="dialogVisible"
                        width="30%"
                >
                    <el-form :model="addUserForm" :rules="rules" ref="addRef" @close="closeDialog">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="addUserForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addUserForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUserForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="mobile" prop="mobile">
                            <el-input v-model="addUserForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
                </el-dialog>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column
                        type="index"
                ></el-table-column>
                <el-table-column
                        label="name" prop="username"
                ></el-table-column>
                <el-table-column
                        label="email" prop="email"
                ></el-table-column>
                <el-table-column
                        label="mobile" prop="mobile"
                ></el-table-column>
                <el-table-column
                        label="role" prop="role_name"
                ></el-table-column>
                <el-table-column
                        label="mg" prop="mg_state"
                >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state"
                                   @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="edit"
                        width="180"
                >
                    <template slot-scope>
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="waring" icon="el-icon-setting">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pageNum"
                           :page-sizes="[10,20,30,40]"
                           :page-size="queryInfo.pageSize"
                           layout="total,sizes,prev,pager,next,jumper"
                           :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            const checkEmail = (rule, value, callback) => {
                const regExp = /^([a-zA-Z0-1_-])+@([a-zA-Z0-1_-])+(\.[a-zA-Z0-1_-])+/;
                if (regExp.test(value)) {
                    return callback(new Error('error'));
                }
            }


            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10,
                },
                userList: [{
                    'id': 32,
                    'username': 'dd',
                    'mobile': '33333',
                    'type': 1,
                    'email': '128219',
                    'create_time': '2017-9-10',
                    'mg_state': true,
                    'role_name': 'admin'
                }],
                total: 5,
                dialogVisible: false,
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },
                rules: {
                    name: [
                        {required: true, message: 'name', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: 'password', trigger: 'blur'},
                        {min: 6, max: 9, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {checkEmail},
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    mobile: [
                        {required: true, message: 'mobile', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {
                    params: this.queryInfo
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('fail')
                }
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            handleSizeChange(size) {
                this.queryInfo.pagesize = size;
                this.getUserList();
            },
            handleCurrentChange(page) {
                this.queryInfo.pagenum = page;
                this.getUserList();
            },
            userStateChange(userState) {
                this.$http.put(`users/${userState.id}/state/${userState.mg_state}`).then(res => {
                    if (res.data.meta.status !== 200) {
                        userState.mg_state = !userState.mg_state;
                        this.$message.error(res.data.meta.msg);
                    }
                    this.$message.success(res.data.meta.msg);
                });

            },
            addUser() {
                this.$refs.addRef.validate(valid => {
                    if (!valid) return;
                    let _this = this;
                    this.$http.post('users', this.addUserForm).then(res => {
                        const data = res.data;
                        if (data.meta.status !== 200) {
                            return _this.$message.error(data.meta.msg);
                        }
                        _this.dialogVisible = false;
                        _this.getUserList();
                        _this.$message.success(data.meta.msg);

                    });
                });
            },
            closeDialog() {
                this.$refs.addRef.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>