package com.example.student_management.repository;

import com.example.student_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 自定义方法：根据用户名查找用户
    User findByUsername(String username);
}