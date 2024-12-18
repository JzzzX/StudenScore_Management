// 成绩管理脚本
let localData = JSON.parse(localStorage.getItem('studentScores')) || []; // 从本地加载数据

// 页面加载时初始化表格
document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
    setupFormListener();
    setupFileUpload();
    autoSaveData();
});

// 封装保存数据到 localStorage 的函数
function saveToLocalStorage() {
    localStorage.setItem('studentScores', JSON.stringify(localData));
}

// 加载成绩数据到表格
function loadTableData() {
    const tbody = document.querySelector('#scoresTable tbody');
    tbody.innerHTML = '';

    localData.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.studentName}</td>
                <td>${item.studentId}</td>
                <td>${item.course}</td>
                <td>${item.score}</td>
                <td>
                    <button onclick="editScore(${index})">编辑</button>
                    <button onclick="deleteScore(${index})">删除</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// 添加成绩监听器
function setupFormListener() {
    const form = document.getElementById('addScoreForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = document.getElementById('studentName').value;
        const studentId = document.getElementById('studentId').value;
        const course = document.getElementById('course').value;
        const score = document.getElementById('score').value;

        if (!studentName || !studentId || !course || score === '') {
            displayMessage("所有字段都必须填写！", 3000);
            return;
        }

        localData.push({ studentName, studentId, course, score });
        saveToLocalStorage();
        loadTableData();
        form.reset();
        displayMessage("成绩已添加并保存到本地！");
    });
}

// 删除成绩
function deleteScore(index) {
    localData.splice(index, 1);
    saveToLocalStorage();
    loadTableData();
    displayMessage("成绩已删除！");
}

// 编辑成绩
function editScore(index) {
    const item = localData[index];
    document.getElementById('studentName').value = item.studentName;
    document.getElementById('studentId').value = item.studentId;
    document.getElementById('course').value = item.course;
    document.getElementById('score').value = item.score;

    deleteScore(index); // 先删除旧数据，修改后重新添加
}

// 自动保存功能（仅在数据变更时触发）
let previousData = JSON.stringify(localData);
function autoSaveData() {
    setInterval(() => {
        const currentData = JSON.stringify(localData);
        if (previousData !== currentData) {
            saveToLocalStorage();
            displayMessage("数据已自动保存到客户端！");
            previousData = currentData;
        }
    }, 30000);
}

// 显示消息提示（可选超时）
function displayMessage(message, timeout = 2000) {
    const messageDiv = document.getElementById('saveMessage');
    messageDiv.textContent = message;
    setTimeout(() => { messageDiv.textContent = ''; }, timeout);
}

// 批量上传文件功能（校验和解析）
function setupFileUpload() {
    document.getElementById('uploadButton').addEventListener('click', async () => {
        const fileInput = document.getElementById('uploadFile');
        if (!fileInput.files.length) return alert("请选择文件！");
       
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // 获取第一个工作表的数据
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const excelDataRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                excelDataRows.forEach(row => {
                    const [studentName, studentId, course, score] = row;

                    // 数据校验
                    if (studentName && studentId && course && score) {
                        localData.push({ studentName, studentId, course, score });
                    }
                });

                saveToLocalStorage();
                loadTableData();
                displayMessage("批量上传成功！");
            } catch (error) {
                displayMessage("文件解析失败，请检查文件格式！", 3000);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}

// 提交数据到服务器
document.getElementById('submitButton').addEventListener('click', async () => {
    try {
        const formData = new FormData();
        const fileInput = document.getElementById('uploadFile');
        if (fileInput.files.length === 0) {
            alert("请选择文件！");
            return;
        }
        formData.append('file', fileInput.files[0]);

        const response = await fetch('http://localhost:8080/api/scores/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`服务器错误：${response.status}`);
        const result = await response.text();
        alert(result);

        localStorage.removeItem('studentScores');
        localData = [];
        loadTableData();
    } catch (error) {
        displayMessage(`提交失败：${error.message}`, 3000);
    }
});