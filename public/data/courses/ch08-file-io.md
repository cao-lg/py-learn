# 文件操作

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握文件读写操作和 JSON 数据处理。</p>
</div>

---

## 一、读写文本文件

```python
# 读取文件
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()          # 读取全部内容
    # 或逐行读取
    # lines = f.readlines()
    # 或
    # for line in f:
    #     print(line)

# 写入文件
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
    f.write("第二行内容")

# 追加内容
with open("output.txt", "a", encoding="utf-8") as f:
    f.write("\n这是追加的内容")
```

---

## 二、JSON 数据处理

```python
import json

# Python 对象转 JSON 字符串
data = {"name": "Alice", "age": 20, "scores": [95, 88, 92]}
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# JSON 字符串转 Python 对象
parsed = json.loads(json_str)
print(parsed["name"])  # "Alice"

# 直接读写 JSON 文件
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

---

## 三、上下文管理器

使用 `with` 语句确保文件正确关闭：

```python
# 推荐写法
with open("file.txt", "r") as f:
    content = f.read()
# 文件在这里自动关闭

# 不推荐的写法
f = open("file.txt", "r")
content = f.read()
f.close()  # 容易忘记，而且可能出异常时不执行
```

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| 文件读取 | ★★★ | read/readlines |
| 文件写入 | ★★★ | write/writelines |
| JSON序列化 | ★★★ | json.dumps/json.dump |
| JSON反序列化 | ★★★ | json.loads/json.load |
| 上下文管理器 | ★★★ | with语句 |

---

<div className="practice-box">
## 📝 技能自测

1. `with` 语句的作用是什么？
2. `json.dumps()` 和 `json.dump()` 的区别是什么？
3. 为什么要指定 encoding="utf-8"？

👉 [开始练习](/practice/ch08_file_io)
</div>

---

**[下一章]** → 异常处理