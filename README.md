# 心灵毒鸡汤一言

# 使用方法  
 * 安装 MongoDB 并创建 Collection `soulposion`
 * 编辑 `config/default.json` 设置你的连接字符串和监听地址端口
 * 安装依赖 运行 `npm install`
 * 使用 `npm run dev` 或者 `node index.js` 启动

# HTTP API
## 文本模式
URL `/text`  

仅返回正文本体

## JSON 模式
URL `/json`  

返回 JSON  

```json
{"content":"正文", "author": "作者", "source": "来源"}
```

此接口也支持 `JSONP` 添加参数 `?callback=xxx` 即可获得 jsonp 调用

## Write 模式
URL `/write`  

返回一个 `Content-Type` 为 `application/javascript` 的回应，直接使用  

```html
<script src="https://example.com/write"></script>
```

即可导入，本质为 `document.write()`

# 向仓库贡献毒鸡汤

## Git 方式（推荐）
 * fork 本仓库并 clone 切换到 data 分支
 * 创建一个你的文件
 * 每行一个毒鸡汤，格式为 `{"content":"正文", "author": "作者", "source": "来源"}`
 * 提交到自己的 `data` 分支，创建一个 `Pull Request`

## Issue 方式
 * 创建一个 Issue
 * 每行一个毒鸡汤，格式为 `{"content":"正文", "author": "作者", "source": "来源"}`
 * 我会尽可能的将 Issue 转为 data 分支上的文件

# 协议
GPL-3.0
