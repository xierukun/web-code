<script setup>
import { ref } from "vue";
import axios from "axios";
const registerFormData = ref({
  username: "",
  password: "",
  password2: "",
  code: "",
});
const registerFormRules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  password2: [
    {
      required: true,
      message: "请确认密码",
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (value !== registerFormData.value.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});
const registerForm = ref(null);
const captchaUrl = ref("/api/user/code");
const captchaLoading = ref(false);
const showPassword = ref(false);


const refreshCaptcha = () => {
  if (captchaLoading.value) {
    return;
  }
  captchaLoading.value = true;
  setTimeout(() => {
    captchaUrl.value = captchaUrl.value + "?t=" + Date.now();
    captchaLoading.value = false;
  }, 1000);
};

const submitForm = () => {
  registerForm.value.validate((valid) => {
    if (valid) {
      axios
        .post("/api/user/register", registerFormData.value, {
          timeout: 5000, // 请求超时时间
          withCredentials: true, // 允许携带 cookies
        })
        .then((res) => {
          if (res.data.code === 200) {
            ElMessage.success("注册成功");
          } else {
            ElMessage.error(res.data.msg);
          }
        });
    }
  });
};
</script>

<template>
  <div class="register-page">
    <el-card class="register-card">
      <h3 class="register-title">注册</h3>
      <el-form
        ref="registerForm"
        :model="registerFormData"
        :rules="registerFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerFormData.password"
            :type="showPassword ? 'text' : 'password'"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input
            v-model="registerFormData.password2"
            :type="showPassword ? 'text' : 'password'"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="captcha-container">
            <img
              class="captcha-img"
              :src="captchaUrl"
              @click="refreshCaptcha"
            />
            <el-input
              v-model="registerFormData.code"
              class="captcha-input"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">注册</el-button>
        </el-form-item>
      </el-form>
      <div class="register-footer">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  padding: 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.register-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
}

.el-form-item__label {
  font-size: 14px;
  color: #333;
}

.el-input {
  width: 100%;
}

.el-icon-view {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: #c0c4cc;
  cursor: pointer;
}

.el-icon-view.active {
  color: #409eff;
}

.captcha-container {
  display: flex;
  align-items: center;
  position: relative;
}

.captcha-img {
  width: 120px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.captcha-input {
  flex: 1;
}

.register-footer {
  margin-top: 20px;
  text-align: right;
  font-size: 14px;
}
</style>
