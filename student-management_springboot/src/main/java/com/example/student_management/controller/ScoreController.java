package com.example.student_management.controller;

import com.example.student_management.model.Score;
import com.example.student_management.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


import java.util.List;

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
}