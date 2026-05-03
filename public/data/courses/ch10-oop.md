# 面向对象编程

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握类的定义、继承、魔术方法和访问控制。</p>
</div>

---

## 一、类和对象

```python
# 定义类
class Person:
    # 类属性
    species = "Human"
    
    # 构造函数
    def __init__(self, name, age):
        self.name = name    # 实例属性
        self.age = age
    
    # 实例方法
    def greet(self):
        return f"Hello, I'm {self.name}"
    
    # 魔术方法
    def __str__(self):
        return f"Person({self.name}, {self.age})"

# 创建对象
alice = Person("Alice", 20)
bob = Person("Bob", 25)

print(alice.greet())        # "Hello, I'm Alice"
print(alice.species)        # "Human"
print(alice)                # "Person(Alice, 20)"
```

---

## 二、继承

```python
# 子类继承父类
class Student(Person):
    def __init__(self, name, age, grade):
        super().__init__(name, age)  # 调用父类构造函数
        self.grade = grade
    
    # 重写方法
    def greet(self):
        return f"Hi, I'm {self.name}, grade {self.grade}"

student = Student("Tom", 15, "A")
print(student.greet())  # "Hi, I'm Tom, grade A"
```

---

## 三、魔术方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):      # 加法 +
        return Vector(self.x + other.x, self.y + other.y)
    
    def __str__(self):             # 字符串表示
        return f"Vector({self.x}, {self.y})"
    
    def __len__(self):             # len()
        return 2
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 类的定义 | ★★★ | __init__ 构造函数 |
| 实例方法 | ★★★ | self 参数 |
| 继承 | ★★★ | super() 调用父类 |
| 魔术方法 | ★★☆ | __str__, __add__ 等 |
| 访问控制 | ★★☆ | 私有属性 |

---

<div className="practice-box">
## 📝 技能自测

1. 类和对象的关系是什么？
2. super() 的作用是什么？
3. __str__ 方法的作用是什么？

👉 [开始练习](/practice/ch10_oop)
</div>

---

## 🎉 课程完成！

恭喜你完成了 Python 基础系列课程的学习！

| 章节 | 主题 | 状态 |
|------|------|------|
| 1 | Python 简介 | ✅ |
| 2 | 变量和数据类型 | ✅ |
| 3 | 运算符 | ✅ |
| 4 | 控制流 | ✅ |
| 5 | 函数 | ✅ |
| 6 | 数据结构 | ✅ |
| 7 | 字符串处理 | ✅ |
| 8 | 文件操作 | ✅ |
| 9 | 异常处理 | ✅ |
| 10 | 面向对象编程 | ✅ |

> 🚀 **下一步**：开始做练习题，巩固所学知识！