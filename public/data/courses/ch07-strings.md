# 字符串处理

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握字符串的基本操作、常用方法和格式化技巧。</p>
</div>

---

## 一、字符串基本操作

```python
# 字符串连接
s1 = "Hello"
s2 = "World"
print(s1 + " " + s2)  # "Hello World"

# 字符串重复
print("-" * 20)  # "--------------------"

# 字符串长度
print(len("Python"))  # 6

# 字符串索引
s = "Python"
print(s[0])   # 'P'
print(s[-1])  # 'n'
```

---

## 二、字符串切片

```python
s = "Hello, World!"

print(s[0:5])      # "Hello"（索引 0-4）
print(s[7:12])     # "World"
print(s[:5])       # "Hello"（从头开始）
print(s[7:])       # "World!"（到末尾）
print(s[::2])       # "Hlo ol!"（步长为2）
print(s[::-1])      # "!dlroW ,olleH"（反转）
```

---

## 三、常用字符串方法

```python
s = "  Hello, World!  "

# 大小写转换
s.upper()          # "  HELLO, WORLD!  "
s.lower()          # "  hello, world!  "
s.title()          # "  Hello, World!  "（每个词首字母大写）

# 去除空白
s.strip()          # "Hello, World!"（去除两端）
s.lstrip()          # "Hello, World!  "（去除左端）

# 查找和替换
s.find("World")     # 9（找不到返回 -1）
s.count("o")        # 2（计数）
s.replace("World", "Python")  # "  Hello, Python!  "

# 分割和连接
s = "apple,banana,orange"
s.split(",")        # ['apple', 'banana', 'orange']
words = ["Hello", "World"]
"-".join(words)     # "Hello-World"
```

---

## 四、字符串格式化

```python
name = "Alice"
age = 20

# f-string（推荐）
print(f"My name is {name}, I'm {age} years old.")

# format() 方法
print("My name is {}, I'm {} years old.".format(name, age))

# 格式化数字
print(f"Pi is approximately {3.14159:.2f}")  # 保留2位小数
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 字符串索引 | ★★★ | 基本操作 |
| 字符串切片 | ★★★ | 常用技巧 |
| 大小写转换 | ★★☆ | upper/lower/title |
| 空白处理 | ★★★ | strip/lstrip/rstrip |
| 查找替换 | ★★☆ | find/replace/count |
| 分割连接 | ★★★ | split/join |
| f-string格式化 | ★★★ | 必须熟练 |

---

<div className="practice-box">
## 📝 技能自测

1. 如何获取字符串的最后一个字符？
2. `s[::-1]` 的作用是什么？
3. f-string 和 format() 哪个更推荐使用？

👉 [开始练习](/practice/ch07_strings)
</div>

---

**[下一章]** → 文件操作