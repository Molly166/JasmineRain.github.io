# JasmineRain's Blog

基于 Hexo 和 Butterfly 主题的个人技术博客。

## 📖 项目简介

这是一个使用 Hexo 静态博客框架构建的个人技术博客，采用 Butterfly 主题，部署在 GitHub Pages 上。博客主要分享技术文章，涵盖算法、数据结构、编程语言、数据库、操作系统等多个技术领域。

## ✨ 功能特性

- 🎨 **现代化界面**：使用 Butterfly 主题，界面美观，支持暗色模式
- 📱 **响应式设计**：完美适配移动端和桌面端
- 🔍 **全文搜索**：支持本地搜索功能
- 💬 **评论系统**：集成 Valine 评论系统
- 📊 **分类标签**：完整的文章分类和标签系统
- 📈 **统计分析**：支持访问量统计
- 🖼️ **图片懒加载**：优化页面加载速度
- 📝 **数学公式**：支持 KaTeX 数学公式渲染
- 💻 **代码高亮**：支持多种编程语言的代码高亮

## 🛠️ 技术栈

- **框架**: Hexo 7.3.0
- **主题**: Butterfly 5.4.3
- **部署**: GitHub Pages
- **评论系统**: Valine
- **数学公式**: KaTeX
- **代码高亮**: highlight.js

## 📦 项目结构

```
hexo-blog/
├── _config.yml              # Hexo 主配置文件
├── _config.butterfly.yml    # Butterfly 主题配置文件
├── package.json             # 项目依赖配置
├── scaffolds/               # 模板文件
├── source/                  # 源文件目录
│   ├── _posts/             # 博客文章
│   ├── categories/          # 分类页面
│   ├── tags/               # 标签页面
│   ├── about/              # 关于页面
│   ├── comments/           # 留言板页面
│   ├── link/               # 友情链接页面
│   ├── music/              # 音乐页面
│   ├── movies/             # 电影页面
│   ├── picture/            # 图片页面
│   └── img/                # 图片资源
├── themes/                 # 主题目录
│   └── butterfly/          # Butterfly 主题
└── public/                 # 生成的静态文件（部署目录）
```

## 🚀 快速开始

### 环境要求

- Node.js >= 12.0
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Molly166/JasmineRain.github.io.git
   cd hexo-blog
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **本地预览**
   ```bash
   hexo server
   ```
   访问 http://localhost:4000 查看博客

4. **生成静态文件**
   ```bash
   hexo generate
   ```

5. **部署到 GitHub Pages**
   ```bash
   hexo deploy
   ```

## 📝 使用说明

### 创建新文章

```bash
hexo new "文章标题"
```

新文章会在 `source/_posts/` 目录下创建 Markdown 文件。

### 文章 Front Matter 示例

```yaml
---
title: 文章标题
date: 2025-11-04 10:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名称
---
```

### 插入图片

使用 Hexo 的 `asset_img` 标签：

```markdown
{% asset_img 图片名.png 图片说明 %}
```

图片文件应放在与文章同名的文件夹中（需要启用 `post_asset_folder: true`）。

### 数学公式

使用 LaTeX 语法：

```markdown
行内公式：$E=mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## ⚙️ 配置说明

### 主要配置文件

- **`_config.yml`**: Hexo 主配置，包括站点信息、URL、部署等
- **`_config.butterfly.yml`**: Butterfly 主题配置，包括菜单、社交链接、评论系统等

### 重要配置项

#### 站点信息（`_config.yml`）
```yaml
title: JasmineRain's blog
subtitle: JasmineRain
description: Better Call JasmineRain
author: JasmineRain
language: zh-CN
url: https://molly166.github.io/JasmineRain.github.io
root: /JasmineRain.github.io/
```

#### 评论系统（`_config.butterfly.yml`）
```yaml
comments:
  use: Valine

valine:
  appId: your_app_id
  appKey: your_app_key
```

#### 部署配置（`_config.yml`）
```yaml
deploy:
  type: git
  repo: https://github.com/Molly166/JasmineRain.github.io.git
  branch: main
```

## 🌐 部署

### GitHub Pages 部署

1. 配置 GitHub Pages 仓库
2. 在 `_config.yml` 中设置正确的 `url` 和 `root`
3. 执行部署命令：
   ```bash
   hexo clean
   hexo generate
   hexo deploy
   ```

### 自定义域名

在 `source/` 目录下创建 `CNAME` 文件，写入你的域名。

## 📚 常用命令

```bash
# 清理缓存和生成的文件
hexo clean

# 生成静态文件
hexo generate
# 或简写
hexo g

# 启动本地服务器
hexo server
# 或简写
hexo s

# 部署到远程仓库
hexo deploy
# 或简写
hexo d

# 组合命令：清理 + 生成 + 部署
hexo clean && hexo g && hexo d
```

## 🔧 插件说明

项目使用的主要插件：

- `hexo-asset-img`: 图片资源处理
- `hexo-asset-link`: 资源链接处理
- `hexo-deployer-git`: Git 部署插件
- `hexo-filter-katex`: KaTeX 数学公式支持
- `hexo-generator-archive`: 归档生成器
- `hexo-generator-category`: 分类生成器
- `hexo-generator-tag`: 标签生成器
- `hexo-generator-search`: 搜索生成器
- `hexo-lazyload-image`: 图片懒加载
- `hexo-wordcount`: 字数统计

## 📖 相关文档

- [Hexo 官方文档](https://hexo.io/docs/)
- [Butterfly 主题文档](https://butterfly.js.org/)
- [Valine 评论系统](https://valine.js.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [Apache-2.0](LICENSE) 许可证。

## 👤 作者

**JasmineRain**

- GitHub: [@Molly166](https://github.com/Molly166)
- Blog: [https://molly166.github.io/JasmineRain.github.io](https://molly166.github.io/JasmineRain.github.io)

## 🙏 致谢

- [Hexo](https://hexo.io/) - 静态博客框架
- [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) - 优秀的 Hexo 主题
- [Valine](https://valine.js.org/) - 评论系统

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star！

