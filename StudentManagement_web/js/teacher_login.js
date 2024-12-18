// teacher_login.js
document.addEventListener("DOMContentLoaded", function () {
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem("teacherLoggedIn");
    if (isLoggedIn && isLoggedIn === "true") {
      alert("您已登录，正在跳转到成绩管理页面...");
      window.location.href = "manage_scores.html";
      return;
    }
  
    // 模拟注册的教师数据
    const defaultTeachers = [
      { username: "teacher1", password: "123456" },
      { username: "teacher2", password: "password" },
    ];
    
    // 如果 localStorage 中没有教师数据，则存入模拟数据
    if (!localStorage.getItem("teachers")) {
      localStorage.setItem("teachers", JSON.stringify(defaultTeachers));
    }
  
    // 登录表单逻辑
    document.getElementById("teacherLoginForm").addEventListener("submit", function (event) {
      event.preventDefault(); // 阻止表单默认提交行为
  
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
  
      // 获取教师数据
      const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
      const isValid = teachers.some((teacher) => teacher.username === username && teacher.password === password);
  
      if (isValid) {
        // 保存登录状态到 localStorage
        localStorage.setItem("teacherLoggedIn", true);
        alert("登录成功！");
        window.location.href = "manage_scores.html"; // 跳转到成绩管理页面
      } else {
        alert("用户名或密码错误，请重试！");
      }
    });
  });