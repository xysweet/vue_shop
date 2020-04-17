<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png"/>
            </div>
            <el-form ref="loginFormRef" label-width="0" :rules="loginFormRules" :model="loginForm" class="login_form">
                <el-form-item prop="username" prefix-icon="el-icon-search">
                    <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" prefix-icon="el-icon-search">
                    <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item  class="btn">
                    <el-button type="promise" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                loginForm:{
                    'username':'',
                    'password':''
                },
                loginFormRules:{
                    username:[
                        {required:true,message:"必填",trigger:'blur'},
                        {max:10,min:2,message: '10~2',trigger: 'blur'}
                    ],
                    password:[
                        {required:true,message:"必填",trigger:'blur'},
                        {max:10,min:2,message: '10~2',trigger: 'blur'}
                    ],
                }
            }
        },
        methods:{
            reset(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate(async valid=>{
                    if(!valid) return ;
                    const {data:res}=await this.$http.post("login",this.loginForm);
                    if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    this.$message.success('success');
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home');
                });
            }
        }

    }
</script>

<style lang="scss" scoped>
.login_container{
    background: #2b4b6b;
    height: 100vh;
}
    .login_box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            overflow: hidden;
            position: absolute;
            left: 50%;
            background: #fff;
            transform: translate(-50%,-50%);
            img{
                background: #eee;;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .login_form{
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
            .btn{
                display: flex;
                justify-content: flex-end;
            }
        }
    }
</style>