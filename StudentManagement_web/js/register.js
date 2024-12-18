document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const username = document.getElementById('name').value;  
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role: "student" })
      });
  
      if (response.ok) {
        alert('注册成功！请前往登录界面登录。');
        window.location.href = 'student_login.html'; // 跳转到登录界面
      } else {
        const error = await response.text();
        document.getElementById('responseMessage').innerText = '注册失败：' + error;
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('responseMessage').innerText = '网络错误，请检查后端连接！';
    }
  });