document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#scoreTable tbody');
    const errorMessage = document.getElementById('errorMessage');
    const userInfo = document.getElementById('userInfo');

    // 读取用户信息
    const studentId = sessionStorage.getItem('studentId');
    const username = sessionStorage.getItem('username');

    // 验证用户登录状态
    if (!studentId || !username) {
        showErrorMessage('未登录，请先登录！');
        return;
    }

    // 显示欢迎信息
    displayWelcomeMessage(username);

    // 获取学生成绩数据
    try {
        await fetchAndRenderScores(studentId, tableBody);
    } catch (error) {
        console.error('Error fetching scores:', error);
        showErrorMessage('无法获取您的成绩，请稍后再试！');
    }
});

/**
 * 显示欢迎消息
 * @param {string} username 用户名
 */
function displayWelcomeMessage(username) {
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerText = `欢迎，${username}！以下是您的成绩：`;
    } else {
        console.error("Error: 'userInfo' element not found.");
    }
}

/**
 * 显示错误消息
 * @param {string} message 错误信息
 */
function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

/**
 * 获取成绩数据并渲染表格
 * @param {string} studentId 学生ID
 * @param {HTMLElement} tableBody 表格的 tbody 元素
 */
async function fetchAndRenderScores(studentId, tableBody) {
    const response = await fetch(`http://localhost:8080/api/scores/${studentId}`);
    if (!response.ok) throw new Error('数据加载失败');

    const scores = await response.json();
    console.log('获取的成绩数据:', scores);

    // 清空旧数据并渲染表格
    tableBody.innerHTML = '';
    scores.forEach(score => {
        const row = `
            <tr>
                <td>${score.course}</td>
                <td>${score.score}</td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}