# 函数

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握函数定义、参数传递、返回值和高阶函数的使用。</p>
</div>

---

## 一、定义和调用函数

```python
# 定义函数
def greet():
    print("Hello!")

# 调用函数
greet()  # 输出: Hello!

# 带参数的函数
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # 输出: Hello, Alice!
```

---

## 二、返回值

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8

# 可以返回多个值
def get_size():
    width = 10
    height = 20
    return width, height

w, h = get_size()  # 拆包
```

---

## 三、参数类型

### 默认参数

```python
def greet(name="World"):
    print(f"Hello, {name}!")

greet()         # Hello, World!
greet("Alice")  # Hello, Alice!
```

### 可变参数 *args

```python
def sum_all(*numbers):
    total = 0
    for n in numbers:
        total += n
    return total

print(sum_all(1, 2, 3))      # 6
print(sum_all(1, 2, 3, 4, 5)) # 15
```

### 关键字参数 **kwargs

```python
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=20, city="Beijing")
```

---

## 四、Lambda 表达式

```python
# 普通函数 vs Lambda
def square(x):
    return x ** 2

square = lambda x: x ** 2
print(square(5))  # 25

# 与 map、filter 结合
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x ** 2, numbers))  # [1, 4, 9, 16, 25]
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]
```

---

## 五、递归函数

```python
def factorial(n):
    if n <= 1:  # 基线条件
        return 1
    return n * factorial(n - 1)  # 递归调用

print(factorial(5))  # 120
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 函数定义与调用 | ★★★ | 必须熟练 |
| 参数与返回值 | ★★★ | 理解参数传递 |
| 默认参数 | ★★★ | 常用技巧 |
| *args 和 **kwargs | ★★☆ | 处理可变参数 |
| Lambda 表达式 | ★★☆ | 配合 map/filter 使用 |
| 递归函数 | ★★☆ | 理解基线条件 |

---

<div className="practice-box">
## 📝 技能自测

1. 如何定义一个带参数的函数？
2. return 和 print 有什么区别？
3. Lambda 表达式适用于什么场景？

👉 [开始练习](/practice/ch05_functions)
</div>

---

**[下一章]** → 数据结构