# **轻量化Web学生管理系统设计与开发**

**前端HTML/CSS/JS + 后端Spring Boot + SQLite**

------

## **1. 项目概述**

### **1.1 项目背景与目标**

本项目源自Web开发期末项目，老师要求使用ASP.NET（非core），但是我认为这种教学脱离实际，并且我能从中学到真正有益处的东西十分有限，故本人此次选择Java Sprong Boot框架作为后端开发。这种是本人第一次接触Spring Boot框架并实现前后端分离的Web开发项目。

通过本项目，我成功实现了基本的学生注册、登陆查询成绩与老师登陆管理成绩功能，技术栈采用前端HTML/CSS/JS + 后端Spring Boot + SQLite，并使用Postman工具对后端接口进行了调试和验证。

### **1.2 项目特点**

- **学习实践性**：本项目为作者Web课程期末作业，主要用于学习Spring Boot框架与SQLite数据库。
- **轻量化架构**：前端静态页面 + 后端Spring Boot + 轻量级SQLite，适合快速部署和小型应用场景。
- **基础功能**：实现了学生注册与登录、教师成绩管理、成绩查看与Excel批量上传等功能。

------

## **2. 技术栈**

### **2.1 前端技术**

- **HTML**：结构化页面内容。
- **CSS**：模块化样式表，提升页面美观性。
- **JavaScript**：实现交互逻辑，提供动态页面功能。

### **2.2 后端技术**

- **Spring Boot**：提供后端服务与API接口，实现前后端分离。
- **Spring Data JPA**：简化数据库操作。
- **Apache POI**：实现Excel文件的批量解析与数据上传。

### **2.3 数据库**

- **SQLite**：轻量级数据库，适合学习和本地部署。

------

## **3. 系统架构**

### **3.1 架构概览**

系统采用前后端分离架构，前端通过静态HTML和JS发起请求，后端Spring Boot提供RESTful API接口，数据通过SQLite存储。

------

### **3.2 项目结构**

#### **前端文件结构**

```plaintext
StudentManagement_web/
├── js/                     # 交互逻辑
│   ├── manage_scores.js
│   ├── register.js
│   ├── student_login.js
│   ├── teacher_login.js
│   └── view_scores.js
├── styles/                 # 样式表
│   ├── global.css
│   ├── index.css
│   ├── manage_scores.css
│   ├── register.css
│   ├── student_login.css
│   └── teacher_login.css
├── index.html              # 主页面
├── manage_scores.html      # 成绩管理页面
├── register.html           # 学生注册页面
├── student_login.html      # 学生登录页面
├── teacher_login.html      # 教师登录页面
└── view_scores.html        # 成绩查看页面
```

#### **后端文件结构**

```plaintext
student-management_springboot/
├── src/
│   ├── main/
│   │   ├── java/com/example/student_management/
│   │   │   ├── controller/   # 控制器
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── ScoreController.java
│   │   │   │   └── UserController.java
│   │   │   ├── model/        # 实体类
│   │   │   │   ├── Score.java
│   │   │   │   └── User.java
│   │   │   ├── repository/   # 数据仓库
│   │   │   │   ├── ScoreRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   └── StudentManagementApplication.java
├── resources/
├── pom.xml                   # Maven 配置文件
└── student_management.db     # SQLite 数据库文件
```

------

## **4. 功能模块**

### **4.1 学生注册与登录**

- **描述**：学生通过注册和登录功能进入系统查看成绩。
- 接口：
	- 注册：`POST /api/users/register`
	- 登录：`POST /api/users/login`
- 示例：

<img src="readme_pictures/截屏2024-12-18 22.35.41.png" alt="截屏2024-12-18 22.35.41" style="zoom:50%;" /><img src="readme_pictures/截屏2024-12-18 22.34.30.png" alt="截屏2024-12-18 22.34.30" style="zoom:50%;" />



- 代码：

```java
	// 用户注册接口
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("用户名已存在");
        }
        userRepository.save(user);
        return ResponseEntity.ok("注册成功");
    }

    // 用户登录验证接口
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {
        System.out.println("Received Login: " + loginUser.getUsername());
        User user = userRepository.findByUsername(loginUser.getUsername());

        if (user == null) {
            return ResponseEntity.badRequest().body("用户不存在");
        }
        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.badRequest().body("密码错误");
        }
        return ResponseEntity.ok("登录成功，角色：" + user.getRole());
    }
```

------

### **4.2 教师登录与成绩管理**

- **描述**：教师登录后管理学生成绩，可批量上传Excel数据。
- 接口：
	- 获取所有成绩：`GET /api/scores`
	- 添加成绩：`POST /api/scores/add`
	- 批量上传：`POST /api/scores/upload`
- 示例：

<img src="readme_pictures/截屏2024-12-18 22.37.54.png" alt="截屏2024-12-18 22.37.54" style="zoom:50%;" />

- 代码：

```java
@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    @Autowired
    private ScoreRepository scoreRepository;

    // 获取所有学生成绩
    @GetMapping
    public ResponseEntity<List<Score>> getAllScores() {
        List<Score> scores = scoreRepository.findAll();
        return ResponseEntity.ok(scores);
    }

    // 添加成绩
    @PostMapping("/add")
    public ResponseEntity<String> addScore(@RequestBody Score score) {
        scoreRepository.save(score);
        return ResponseEntity.ok("成绩添加成功");
    }

    // 根据学生ID获取成绩
    @GetMapping("/{studentId}")
    public ResponseEntity<List<Score>> getScoresByStudentId(@PathVariable String studentId) {
        List<Score> scores = scoreRepository.findByStudentId(studentId);
        return ResponseEntity.ok(scores);
    }

    // 上传文件
    @PostMapping("/upload")
    public ResponseEntity<String> uploadScores(@RequestParam("file") MultipartFile file) {
        try {
            // 文件为空检查
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("文件为空，请上传有效的文件！");
            }

            // 文件解析日志
            System.out.println("收到文件：" + file.getOriginalFilename());

            // 确保文件类型正确
            if (!file.getOriginalFilename().endsWith(".xlsx") && !file.getOriginalFilename().endsWith(".xls")) {
                return ResponseEntity.badRequest().body("请上传 Excel 文件 (.xls 或 .xlsx)！");
            }

            // 解析 Excel 文件
            InputStream inputStream = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0); // 获取第一个工作表
            List<Score> scores = new ArrayList<>();

            // 遍历 Excel 文件中的行，从第2行开始（跳过表头）
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // 跳过标题行

                String studentName = row.getCell(0).getStringCellValue();
                String studentId = row.getCell(1).getStringCellValue();
                String course = row.getCell(2).getStringCellValue();
                int score = (int) row.getCell(3).getNumericCellValue();

                // 数据校验
                if (studentName == null || studentId == null || course == null) {
                    return ResponseEntity.badRequest().body("数据格式错误，请检查 Excel 文件内容！");
                }

                // 创建 Score 对象
                Score newScore = new Score();
                newScore.setStudentName(studentName);
                newScore.setStudentId(studentId);
                newScore.setCourse(course);
                newScore.setScore(score);
                scores.add(newScore);
            }

            // 保存到数据库
            scoreRepository.saveAll(scores);

            return ResponseEntity.ok("文件上传成功，成绩已保存到数据库！");
        } catch (Exception e) {
            // 输出详细异常信息
            e.printStackTrace();
            return ResponseEntity.status(500).body("服务器内部错误：" + e.getMessage());
        }
    }
```

------

### **4.3 学生成绩查看**

- **描述**：学生登录后可查看个人成绩。
- **接口**：`GET /api/scores/{studentId}`
- 示例：

<img src="readme_pictures/截屏2024-12-18 22.39.09.png" alt="截屏2024-12-18 22.39.09" style="zoom:50%;" />

------

## **5. 数据库设计**

由于本项目使用**SQLite**，数据表结构简单，并未提供ER图.

在我的 Spring Boot 后端项目中，数据库与后端结合主要通过 **Spring Data JPA** 和 **SQLite** 实现，具体步骤如下：

### **引入 Spring Boot 与 SQLite 依赖**

通过 **`pom.xml`** 文件引入所需依赖，Spring Boot 使用 **Spring Data JPA** 操作 SQLite 数据库。

**依赖配置示例**

```xml
<dependencies>
    <!-- Spring Boot Starter Web：提供 RESTful API 支持 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA：实现数据库持久层操作 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- SQLite 驱动依赖 -->
    <dependency>
        <groupId>org.xerial</groupId>
        <artifactId>sqlite-jdbc</artifactId>
        <version>3.36.0</version>
    </dependency>

    <!-- Spring Boot Starter Test（可选） -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

------

### **配置 SQLite 数据源**

在 **`application.properties`** 文件中配置 SQLite 数据库连接。

**配置示例**

```properties
# 数据源配置
spring.datasource.url=jdbc:sqlite:student_management.db
spring.datasource.driver-class-name=org.sqlite.JDBC

# JPA 配置
spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- **`jdbc:sqlite:student_management.db`**：指向项目根目录下的 SQLite 数据库文件。
- **`spring.jpa.hibernate.ddl-auto=update`**：自动更新表结构。
- **`spring.jpa.show-sql=true`**：在控制台显示 SQL 语句，便于调试。

------

### **定义实体类（Model）**

在 **`model`** 包中定义数据库表的实体类，并通过 **`@Entity`** 注解将类映射为数据库表。

**示例：User 实体类**

```java
package com.example.student_management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String role;

    // Getters 和 Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
```

------

### **创建 Repository 接口**

通过 **Spring Data JPA**，创建用于操作数据库的接口。

**示例：UserRepository**

```java
package com.example.student_management.repository;

import com.example.student_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
```

- **`JpaRepository`**：提供了常用的数据库操作方法，如 `save()`、`findById()`、`delete()` 等。
- **自定义方法**：通过方法名解析，`findByUsername` 会自动生成查询语句来查询 `username` 字段。

------

### **编写 Controller 控制器**

在 **`controller`** 包中定义接口，通过调用 `UserRepository` 实现数据库操作。

 **示例：UserController**

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 注册用户
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("用户名已存在");
        }
        userRepository.save(user); // 保存用户信息到数据库
        return ResponseEntity.ok("注册成功");
    }

    // 用户登录
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {
        User user = userRepository.findByUsername(loginUser.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body("用户不存在");
        }
        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.badRequest().body("密码错误");
        }
        return ResponseEntity.ok("登录成功，角色：" + user.getRole());
    }
}
```

------

### **启动 Spring Boot 项目**

运行 **`StudentManagementApplication.java`** 启动类，Spring Boot 将：

1. 自动连接 SQLite 数据库。
2. 根据实体类生成对应的数据库表（通过 Hibernate）。
3. 暴露 RESTful API 接口。

**启动类示例**

```java
@SpringBootApplication
public class StudentManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
    }
}
```

------

### **总结：Spring Boot 与 SQLite 结合过程**

1. **引入依赖**：Spring Data JPA 和 SQLite 驱动。
2. **配置数据源**：在 `application.properties` 中指定 SQLite 数据库连接。
3. **定义实体类**：使用 `@Entity` 和 `@Table` 将 Java 类映射为数据库表。
4. **创建 Repository**：继承 `JpaRepository`，实现数据库操作。
5. **编写 Controller**：通过 Repository 接口操作数据库并提供 API。
6. **启动项目**：Spring Boot 自动完成数据库初始化和表创建。

通过这些步骤，实现了 SQLite 数据库与 Spring Boot 后端的无缝集成，并通过 RESTful API 提供前后端交互接口。

### **用户表（User）**

| 字段     | 类型        | 描述       |
| -------- | ----------- | ---------- |
| id       | INTEGER     | 主键，自增 |
| username | VARCHAR(50) | 用户名     |
| password | VARCHAR(50) | 用户密码   |

### **成绩表（Score）**

| 字段        | 类型        | 描述       |
| ----------- | ----------- | ---------- |
| id          | INTEGER     | 主键，自增 |
| studentName | VARCHAR(50) | 学生姓名   |
| studentId   | VARCHAR(50) | 学生编号   |
| course      | VARCHAR(50) | 课程名称   |
| score       | INTEGER     | 学生成绩   |

------

## **6. 接口测试**

本项目使用**Postman**进行API接口测试，确保功能的正确性与稳定性。

### **示例测试用例**

1. **学生登录接口**

	- 请求：`POST /api/users/login`

	- 参数：

		```json
		{
		  "username": "student1",
		  "password": "password123"
		}
		```

	- 响应：`登录成功`

2. **批量上传成绩**

	- 请求：`POST /api/scores/upload`
	- 上传：Excel文件
	- 响应：`批量成绩上传成功`

	<img src="readme_pictures/截屏2024-12-18 22.59.12 1.png" alt="截屏2024-12-18 22.59.12 1" style="zoom:50%;" />

------

## **7. 遇到的问题与解决方案**

1. CORS跨域问题
	- **解决方案**：在后端添加 `CorsConfig` 配置类。
2. Excel文件解析问题
	- **解决方案**：使用 Apache POI 处理文件格式异常。

------

## **8. 总结与展望**

本次项目总共耗时约10小时左右进行开发：

<img src="readme_pictures/截屏2024-12-17 23.41.10.png" alt="截屏2024-12-17 23.41.10" style="zoom:50%;" /><img src="readme_pictures/截屏2024-12-17 23.42.06.png" alt="截屏2024-12-17 23.42.06" style="zoom:50%;" />

本项目作为学习Spring Boot的实践项目，顺利完成了学生信息与成绩管理功能。未来可优化的方向包括：

- 增加**响应式前端设计**，适配移动端。
- 引入**数据分析功能**，可视化学生成绩统计。
- 使用**MySQL**等更具扩展性的数据库替代SQLite。

------

此文档覆盖项目全流程与技术细节，感谢您的阅读！
