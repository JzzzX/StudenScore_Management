document.getElementById('studentLoginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // 保持与后端的字段一致
        });

        if (response.ok) {
            const result = await response.text();
            // 保存用户信息
            sessionStorage.setItem('studentId', '1001'); 
            sessionStorage.setItem('username', username); 
            alert('登录成功：' + result);
            window.location.href = 'view_scores.html'; // 跳转到成绩页面
        } else {
            const error = await response.text();
            document.getElementById('responseMessage').innerText = '登录失败：' + error;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerText = '网络错误，请检查后端连接！';
    }
});