<template>
    <el-container class="home-container">
        <el-header>
            <div><img src="../assets/logo.png" alt=""><span>电商管理系统</span></div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="collapse?'64px':'200px'">
                <div class="toggle-button" @click="collapse = !collapse">{{collapse?"三":'|||'}}</div>
                <el-menu background-color="#333744"
                         text-color="#fff"
                         unique-opened
                         :collapse="collapse"
                         :collapse-transition="false"
                         router
                         :default-active="activePath"
                         active-text-color="#ffd04b">
                    <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="objIcon[item.id]"></i><span>{{item.authName}}</span>
                        </template>
                        <el-menu-item @click="changeActivePath('/'+it.path)" :index="'/'+it.path" v-for="it in item.children" :key="it.id">
                            <i :class="objIcon[it.id]"></i><span>{{it.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return{
                menuList:[],
                objIcon:{
                    '125':'el-icon-menu',
                    '103':'el-icon-search',
                    '101':'el-icon-share',
                    '102':'el-icon-edit',
                    '145':'el-icon-goods',
                },
                collapse:false,
                activePath:'/welcome'
            }
        },
        created() {
            this.activePath=window.sessionStorage.getItem('activePath');
            this.getMenuList();
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
            },
            async getMenuList(){
                const {data:res}=await this.$http.get('menus');
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.menuList=res.data;
            },
            changeActivePath(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath=activePath;
            }

        }
    }
</script>

<style scoped lang="scss">
    .home-container {
        width: 100%;
        height: 100vh;

        .el-header {
            display: flex;
            justify-content: space-between;
            background-color: #373d41;
            padding-left: 4px;
            align-items: center;
            color: #fff;
            font-size: 20px;

            > div {
                display: flex;
                align-items: center;

                img {
                    width: 20px;
                }

                span {
                    margin-left: 15px;
                }
            }
        }

        .el-aside {
            background-color: #373d41;
            height: 100%;
            .el-menu{
                border-right: none;
            }
            .toggle-button{
                text-align: center;
                font-size: 10px;
                line-height: 24px;
                color: #fff;
                background-color: #4a5064;
                letter-spacing: .2em;
                cursor: pointer;
            }
        }

        .el-main {
            background-color: #fff;
        }
    }
</style>