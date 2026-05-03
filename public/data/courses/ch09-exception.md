# 异常处理

<div className="intro-card">
  <h3>🎯 学习目标</h3>
  <p>本章核心目标：掌握 try-except 异常捕获和处理机制。</p>
</div>

---

## 一、基本的 try-except

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("错误：除数不能为零！")
except ValueError:
    print("错误：值类型不正确！")
```

---

## 二、捕获异常对象

```python
try:
    num = int(input("请输入一个数字："))
except ValueError as e:
    print(f"输入错误：{e}")
```

---

## 三、完整的异常处理结构

```python
try:
    # 可能出错的代码
    risky_operation()
except SomeError:
    # 处理特定异常
    handle_error()
except Exception as e:
    # 捕获其他所有异常
    print(f"未知错误：{e}")
else:
    # 没有异常时执行
    print("操作成功！")
finally:
    # 无论是否有异常都执行
    cleanup()
```

---

## 四、常见的异常类型

| 异常类型 | 说明 |
|---------|------|
| `ZeroDivisionError` | 除数为零 |
| `ValueError` | 值类型错误 |
| `TypeError` | 类型错误 |
| `IndexError` | 索引超出范围 |
| `KeyError` | 字典键不存在 |
| `FileNotFoundError` | 文件不存在 |

---

## ✅ 本章核心技能清单

| 技能点 | 掌握程度 | 练习建议 |
|--------|----------|---------|
| try-except 基本用法 | ★★★ | 必须熟练 |
| 捕获多个异常 | ★★★ | except 多个类型 |
| 获取异常信息 | ★★☆ | as e |
| else/finally 子句 | ★★☆ | 清理资源 |
| 手动抛出异常 | ★★☆ | raise |

---

<div className="practice-box">
## 📝 技能自测

1. try-except 的作用是什么？
2. else 和 finally 的区别是什么？
3. 为什么不建议用空 except？

👉 [开始练习](/practice/ch09_exception)
</div>

---

**[下一章]** → 面向对象编程