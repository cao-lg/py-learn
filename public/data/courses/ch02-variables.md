# 变量和数据类型

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握变量定义、基本数据类型和类型转换。</p>
</div>

---

## 一、什么是变量？

变量是存储数据的**容器**，可以看作是给数据贴的标签。

```python
# 创建变量
name = "Alice"  # 字符串
age = 25        # 整数
score = 95.5    # 浮点数
is_student = True  # 布尔值
```

**变量命名规则：**
- ✅ 字母、数字、下划线组成
- ✅ 必须以字母或下划线开头
- ❌ 不能以数字开头
- ❌ 不能使用连字符或空格

```python
# 推荐命名风格
user_name = "Bob"    # 下划线命名（Python 推荐）
userName = "Charlie" # 驼峰命名（JavaScript 风格）
MAX_SIZE = 100       # 全大写表示常量（约定）
```

---

## 二、基本数据类型

Python 有四种核心数据类型：

| 类型 | 示例 | 说明 |
|------|------|------|
| `int` | `42`, `0`, `-10` | 整数 |
| `float` | `3.14`, `2.0`, `-0.5` | 浮点数 |
| `str` | `"Hello"`, `'World'` | 字符串 |
| `bool` | `True`, `False` | 布尔值 |

### 字符串操作

```python
# 字符串拼接
greeting = "Hello, " + "World!"  # "Hello, World!"

# 字符串重复
echo = "Ha" * 3  # "HaHaHa"

# 字符串长度
length = len("Python")  # 6

# 字符串索引
s = "Hello"
print(s[0])  # "H"（第一个字符）
print(s[-1]) # "o"（最后一个字符）
```

### 布尔值

```python
# 布尔运算
print(True and False)   # False
print(True or False)    # True
print(not True)         # False

# 比较运算返回布尔值
print(5 > 3)   # True
print(5 == 3)  # False
```

---

## 三、类型转换

不同类型之间可以相互转换：

```python
# 转换为整数
int("42")        # 42
int(3.9)         # 3（向下取整）

# 转换为浮点数
float("3.14")    # 3.14
float(42)        # 42.0

# 转换为字符串
str(42)          # "42"
str(3.14)        # "3.14"

# 转换为布尔值（空值为 False）
bool(0)          # False
bool("")         # False
bool("hello")    # True
bool([1,2,3])   # True
```

---

## 四、变量操作

```python
# 多次赋值
x = 10
print(x)  # 10

x = 20
print(x)  # 20

# 增量赋值
count = 0
count += 1    # count = count + 1 → 1
count *= 2    # count = count * 2 → 2

# 交换变量（Python 特色）
a, b = 10, 20
a, b = b, a   # a=20, b=10
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 变量定义与命名 | ★★★ | 必须熟练 |
| 基本数据类型 | ★★★ | int/float/str/bool |
| 类型转换 | ★★★ | int()/float()/str()/bool() |
| 字符串操作 | ★★☆ | 拼接、长度、索引 |
| 增量赋值 | ★★☆ | +=, -=, *=, /= |

---

<div className="practice-box">
## 📝 技能自测

1. 如何创建一个存储姓名的变量？
2. `int(3.9)` 的结果是多少？
3. 如何交换两个变量的值？

👉 [开始练习](/practice/ch02_variables)
</div>

---

**[下一章]** → 运算符