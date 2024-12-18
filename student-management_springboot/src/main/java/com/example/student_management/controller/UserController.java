package com.example.student_management.controller;

import com.example.student_management.model.User;
import com.example.student_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

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
}