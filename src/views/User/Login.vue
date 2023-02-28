<template>
  <div class="loginBox">
    <div class="item">
      <span class="label">账 号</span>
      <div class="input">
        <input type="text" placeholder="请输入账号" v-model="account" />
      </div>
    </div>
    <div class="item">
      <span class="label">密 码</span>
      <div class="input">
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>
    </div>
    <!--<div class="item yzCode">-->
    <!--<span class="label">验证码</span>-->
    <!--<div class="input">-->
    <!--<input type="text" placeholder="填写验证码" v-model="yzCode">-->
    <!--</div>-->
    <!--</div>-->
    <div class="loginBtn">
      <button @click="login" :disabled="isLogining">
        {{ loginText }}
      </button>
    </div>
  </div>
</template>
<script>
import { LOGIN } from "@/api";
export default {
  name: "login",
  data() {
    return {
      account: "", //xadmin
      password: "", //123456
      // yzCode: "1234", 
      loginText: "登录",
      isLogining: false,
    };
  },
  mounted() {
    // 清除登录信息
    sessionStorage.removeItem("vuex");
    this.initKeyEnterLogin();
  },
  watch: {
    $route: {
      handler: (route) => {
        console.log(route);
        const reload = route.query.reload;
        if (reload) {
          window.location.href = window.location.href.replace(
            "?reload=true",
            ""
          );
        }
      },
      immediate: true,
    },
  },
  methods: {
    reload() {
      window.location.reload();
    },
    initKeyEnterLogin() {
      document.addEventListener("keyup", (e) => {
        const code = e.key;
        console.log(code);
        if (code == "Enter") {
          this.login();
        }
      });
    },
    login() {
      if (!this.account) {
        this.$message.error("请输入用户名");
        return false;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return false;
      }
      this.loginText = "登录中";
      this.isLogining = true;
      // if(this.yzCode != '1234'){
      //   this.$message.error('验证码不正确！');
      //   return false;
      // }
      let closeLoading = this.$message.loading("登录中...", 0);
      let params = {
        username: this.account,
        password: this.password,
      };
      console.log(LOGIN);
      this.loginText = "登录中";
      this.isLogining = true;
      this.$axios
        .post(LOGIN, params)
        .then((data) => {
          closeLoading();
          if (data && data.code == 1) {
            this.$message.success("登录成功！", 2.5);
            this.$store.commit("setUserName", this.account);
            this.$store.commit("setToken", data.value.Authorization);
            this.$store.commit("setModules", data.value.sysModules);
            this.$store.commit("setOrgId", data.value.SoId);
            const roles = data.value.roles;
            let rolesType = [];
            if (roles && roles.length) {
              roles.map((item) => {
                rolesType.push(item.roleType);
              });
              this.$store.commit("setRoles", rolesType);
            }

            this.$router.replace("/");
          }
          if (data && data.code == -1) {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.isLogining = false;
          this.loginText = "登录";
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.loginBox {
  width: 610px;
  height: 400px;
  margin: 30px auto;
  padding: 60px 80px;
  box-shadow: 0 4px 10px 6px #111442;
  background-image: linear-gradient(to bottom, #15184d, #3940ad);
  .item {
    margin-bottom: 40px;
    height: 40px;
    line-height: 40px;
    display: flex;
    .label {
      display: flex;
      width: 80px;
      font-size: 16px;
      color: #859fff;
    }
    .input {
      width: 360px;
      line-height: 40px;
      position: relative;
      flex: 1;
      input {
        width: 100%;
        line-height: 40px;
        font-size: 16px;
        background-color: transparent;
        border: none;
        outline: none;
        color: #fff;
        text-indent: 10px;
      }
      input::-webkit-input-placeholder {
        color: #a7adc0;
      }
      &:after {
        content: "";
        width: 360px;
        height: 1px;
        position: absolute;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(to right, #475277, #fff, #475277);
      }
    }
    &.yzCode {
      width: 260px;
      .input {
        width: 260px;
        &:after {
          width: 260px;
        }
      }
    }
  }
}
.loginBtn {
  margin-top: 80px;
  text-align: center;
  button {
    cursor: pointer;
    border: none;
    background-color: #6f78e8;
    padding: 10px 50px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    border-radius: 6px;
    transition: all 0.3s ease;
    outline: none;
    &:hover {
      background-color: #e45615;
    }
    &[disabled="disabled"] {
      cursor: not-allowed;
      background-color: #7b7f80;
      &:hover {
        background-color: #646262;
      }
    }
  }
}
</style>
