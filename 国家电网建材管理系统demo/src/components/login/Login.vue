<template>
    <div class="logWrapper">
        <el-button class="login" size="mini" type="success" @click="goLog" >{{logName}}</el-button>
        <div v-if="isLog" class="logPannel" @click.self="closeLog">
             <div class="loginPage">
                <h1>登录</h1>
                <el-form>
                    <el-form-item label="user">
                        <el-input type="text" id="user" @blur="inputBlur('user',userName)" v-model="userName"></el-input>
                        <p>{{userError}}</p>
                    </el-form-item>
                    <el-form-item label="password">
                        <el-input type="password" id="password" @input="inputBlur('password',password)" v-model="password"></el-input>
                        <p>{{passwordError}}</p>
                    </el-form-item>
                    <el-button type="primary" :disabled="canSubmit" @click="submit">提交</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form>              
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                isLog: false,
                logName: '登陆',
                userName: '',
                password: '',
                userError:'',
                passwordError:'',
                canSubmit:true
            }
        },
        methods:{
            goLog() {
                this.isLog = true;
            },
            closeLog() {
                this.isLog = false;
            },
            reset() {
                this.userName = '';
                this.password = '';
            },
            submit() {
                if (this.userName === 'admin' && this.password === 'xuyingxue') {
                    this.isLog = false;
                    this.logName = "Admin"
                    this.$message({
                        message: '登陆成功',
                        type: 'success'
                    });
                } else {
                   this.$message({
                        message: '用户名密码错误',
                        type: 'error'
                    }); 
                }
            },
            inputBlur(type,content) {
                console.log('blur');
                if(type === 'user') {
                    if( content === '') {
                        this.userError = '用户名不能为空';
                    }else {
                        this.userError = '';
                    }
                }else if( type === 'password'){
                    if (content === '') {
                        this.passwordError = '密码不能为空';
                    }else {
                        this.passwordError = '';
                    }
                }
                if(this.password != '' && this.userName != '') {
                    this.canSubmit = false;
                }else {
                    this.canSubmit = true;
                }
            }
        }
    }
</script>
<style lang="sass">
    .logWrapper
        display: inline-block
        .logPannel
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 100%
            background: rgba(0,0,0,.8)
            .loginPage
                position: absolute
                top: 50%
                left: 50%
                margin-top: -150px
                margin-left: -175px
                width: 350px
                min-height: 300px
                padding: 30px 20px 20px
                border-radius: 8px
                box-sizing: border-box
                background-color: #fff
                p 
                    color: red
                    text-align: left
</style>
