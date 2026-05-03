# 控制流

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握条件语句（if-elif-else）和循环语句（for、while）的使用。</p>
</div>

---

## 一、条件语句 if-elif-else

```python
# 基础语法
age = 18

if age >= 18:
    print("已成年")
else:
    print("未成年")

# 多条件判断
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

**条件表达式（三元运算符）：**
```python
result = "成年" if age >= 18 else "未成年"
print(result)
```

---

## 二、循环语句

### for 循环

```python
# 遍历列表
fruits = ["苹果", "香蕉", "橙子"]
for fruit in fruits:
    print(fruit)

# 遍历数字 range()
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):    # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8（步长为2）
    print(i)
```

### while 循环

```python
count = 0

while count < 5:
    print(count)
    count += 1
```

---

## 三、break 和 continue

```python
# break - 提前退出循环
for i in range(10):
    if i == 5:
        break
    print(i)  # 输出 0, 1, 2, 3, 4

# continue - 跳过当前迭代
for i in range(5):
    if i == 2:
        continue
    print(i)  # 输出 0, 1, 3, 4
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| if-elif-else | ★★★ | 必须熟练 |
| for 循环 | ★★★ | 配合 range() 使用 |
| while 循环 | ★★★ | 注意循环条件 |
| break/continue | ★★☆ | 控制循环流程 |
| 嵌套循环 | ★★☆ | 九九乘法表练习 |

---

<div className="practice-box">
## 📝 技能自测

1. 如何判断一个数是奇数还是偶数？
2. for 循环和 while 循环有什么区别？
3. break 和 continue 的区别是什么？

👉 [开始练习](/practice/ch04_control_flow)
</div>

---

**[下一章]** → 函数