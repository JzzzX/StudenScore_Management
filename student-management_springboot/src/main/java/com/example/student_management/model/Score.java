package com.example.student_management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "scores") // 数据表名为 "scores"
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 主键自增
    private Long id;

    @Column(nullable = false)
    private String studentName; // 学生姓名

    @Column(nullable = false)
    private String studentId; // 学生ID

    @Column(nullable = false)
    private String course; // 课程名称

    @Column(nullable = false)
    private Integer score; // 分数

    // Getters 和 Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}