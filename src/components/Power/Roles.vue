<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 30px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
                <el-table :data="roleList" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-row type="flex" align="center" :class="['bdBottom',i1==0?'bdTop':'']"
                                    v-for="(item,i1) in scope.row.children" :key="i1">
                                <el-col :span="5">
                                    <el-tag type="primary" closable @close="removeRightById(scope.row,item.id)">
                                        {{item.authName}}

                                    </el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="19">
                                    <el-row :class="['bdBottom',i2==0?'bdTop':'']" v-for="(it,i2) in item.children"
                                            :key="i2">
                                        <el-col :span="5">
                                            <el-tag type="warn" closable @close="removeRightById(scope.row,it.id)">
                                                {{it.authName}}
                                            </el-tag>
                                            <i class="el-icon-arrow-right"></i>
                                        </el-col>
                                        <el-col :span="19">
                                            <el-tag v-for="(it2,i3) in it.children" :key="i3" closable
                                                    @close="removeRightById(scope.row,it2.id)">
                                                {{it2.authName}}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="角色名称" prop="roleName"></el-table-column>
                    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-edit" @click="scope"></el-button>
                            <el-button icon="el-icon-setting" @click="setShowRightDialog(scope.row)"></el-button>
                            <el-button icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
        <el-dialog title="分配权限" :visible.sync="setRightDialog" width="30%" @close="setRightDialogCLose">
            <el-tree :data="treeList" :props="treeProps" ref="treeRef"
                     show-checkbox default-expand-all
                     node-key="id" :default-checked-keys="defaultChecked"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialog=false">cancel</el-button>
                <el-button @click="allowTree" type="primary">sure</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                roleList: [],
                setRightDialog: false,
                treeList: [],
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                defaultChecked:[],
                roleId:'',
            }
        },
        created() {
            this.getRoleList();
        },
        methods: {
            async getRoleList() {
                const {data: res} = await this.$http.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                this.roleList = res.data;
            },
            async removeRightById(role, rightId) {

                const confirmResult = await this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonClass: 'cancel',
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult !== 'confirm') {
                    return this.$message.info('cancel');
                }
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg);
                }
                role.children = res.data;
            },
            async setShowRightDialog(row) {
                this.roleId=row.id;
                const {data: res} = await this.$http.get('rights/tree');
                if (res.meta.status!==200) {
                    return this.$message.error(res.meta.msg);
                }
                this.treeList = res.data;
                this.getLeafKeys(row,this.defaultChecked)
                this.setRightDialog = true;
            },
            getLeafKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id);
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr)
                })
            },
            setRightDialogCLose(){
                this.defaultChecked=[];
            },
          async  allowTree(){
                const key=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr=key.join(',');

                const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});

                if(res.meta.status!==200){
                    return this.$message.error(res.meta.msg)
                }

                this.setRightDialog=false;
            },
        }
    }
</script>

<style scoped lang="scss">
    .el-tag {
        margin: 7px;
    }

    .bdTop {
        border-top: 1px solid #eee;
    }

    .bdBottom {
        border-bottom: 1px solid #eee;
    }
</style>