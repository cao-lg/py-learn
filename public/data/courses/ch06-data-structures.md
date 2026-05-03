# 数据结构

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握列表、元组、字典和集合的基本操作和使用场景。</p>
</div>

---

## 一、列表 (List)

列表是**可变**的有序序列：

```python
# 创建列表
fruits = ["苹果", "香蕉", "橙子"]
numbers = [1, 2, 3, 4, 5]

# 索引和切片
fruits[0]     # "苹果"（第一个元素）
fruits[-1]    # "橙子"（最后一个元素）
fruits[1:3]   # ["香蕉", "橙子"]（切片）

# 修改列表
fruits.append("葡萄")    # 末尾添加
fruits.insert(1, "梨")  # 指定位置插入
fruits.remove("香蕉")    # 删除元素

# 列表推导式
squares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]
```

---

## 二、元组 (Tuple)

元组是**不可变**的有序序列：

```python
# 创建元组
point = (3, 4)
colors = ("红", "绿", "蓝")

# 元组解包（Python特色）
x, y = point
print(f"x={x}, y={y}")  # x=3, y=4

# 单元素元组（注意逗号）
single = (5,)  # 不是 (5)，那是整数
```

---

## 三、字典 (Dict)

字典存储**键值对**：

```python
# 创建字典
person = {
    "name": "Alice",
    "age": 20,
    "city": "Beijing"
}

# 访问和修改
person["name"]     # "Alice"
person["age"] = 21       # 修改值
person["email"] = "a@b.com"  # 添加新键值对

# 字典方法
person.keys()    # 所有键
person.values()  # 所有值
person.items()   # 所有键值对
person.get("gender", "未知")  # 安全获取（带默认值）
```

---

## 四、集合 (Set)

集合是**无序不重复**的元素集合：

```python
# 创建集合
colors = {"红", "绿", "蓝"}
nums = {1, 2, 3, 2, 1}  # 自动去重：{1, 2, 3}

# 数学运算
a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)   # {1, 2, 3, 4}  并集
print(a & b)   # {2, 3}         交集
print(a - b)   # {1}             差集
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 列表基本操作 | ★★★ | 增删改查 |
| 列表推导式 | ★★★ | 简化代码 |
| 元组解包 | ★★★ | Python特色 |
| 字典操作 | ★★★ | 键值对管理 |
| 集合运算 | ★★☆ | 去重和集合操作 |

---

<div className="practice-box">
## 📝 技能自测

1. 列表和元组的主要区别是什么？
2. 如何安全获取字典中不存在的键？
3. 集合的主要特性是什么？

👉 [开始练习](/practice/ch06_data_structures)
</div>

---

**[下一章]** → 字符串处理