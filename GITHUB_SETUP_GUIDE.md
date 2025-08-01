# GitHub 仓库创建和管理指南

本指南将详细介绍如何为 PromptHUB 项目创建 GitHub 仓库并进行后续管理。

## 📋 前置准备

### 1. 确保已安装 Git
```bash
git --version
```

### 2. 配置 Git 用户信息
```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

## 🚀 创建 GitHub 仓库

### 方法一：通过 GitHub 网站创建

1. **登录 GitHub**
   - 访问 [github.com](https://github.com)
   - 登录你的账户

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

3. **配置仓库信息**
   ```
   Repository name: prompthub
   Description: 开源的提示词分享平台，让创作者自由交流和协作
   Visibility: Public (推荐) 或 Private
   
   ✅ Add a README file (不勾选，我们已有README.md)
   ✅ Add .gitignore (不勾选，我们已有.gitignore)
   ✅ Choose a license: MIT License (推荐)
   ```

4. **点击 "Create repository"**

### 方法二：通过 GitHub CLI 创建

如果你安装了 GitHub CLI：

```bash
# 创建仓库
gh repo create prompthub --public --description "开源的提示词分享平台，让创作者自由交流和协作"

# 或创建私有仓库
gh repo create prompthub --private --description "开源的提示词分享平台，让创作者自由交流和协作"
```

## 📤 将本地代码推送到 GitHub

### 1. 添加远程仓库
```bash
# 替换 your-username 为你的 GitHub 用户名
git remote add origin https://github.com/your-username/prompthub.git
```

### 2. 添加所有文件到暂存区
```bash
git add .
```

### 3. 创建初始提交
```bash
git commit -m "🎉 Initial commit: PromptHUB 开源提示词分享平台

✨ Features:
- 多主题系统 (白天/黑夜/护眼/纸质/星空)
- 智能标签系统 (12色动态标签)
- 响应式设计
- 玻璃拟态UI
- 动画效果

🛠️ Tech Stack:
- Next.js 13.5 + React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion"
```

### 4. 推送到 GitHub
```bash
# 首次推送，设置上游分支
git push -u origin main

# 如果遇到分支名称问题，可能需要：
git branch -M main
git push -u origin main
```

## 🔄 日常开发流程

### 1. 检查状态
```bash
git status
```

### 2. 添加更改
```bash
# 添加特定文件
git add filename.tsx

# 添加所有更改
git add .

# 添加所有已跟踪文件的更改
git add -u
```

### 3. 提交更改
```bash
# 简单提交
git commit -m "fix: 修复主题切换问题"

# 详细提交（推荐）
git commit -m "feat: 添加新的标签过滤功能

- 添加标签筛选组件
- 实现多标签选择
- 优化搜索性能
- 更新相关测试

Closes #123"
```

### 4. 推送更改
```bash
git push
```

## 🌿 分支管理

### 创建新分支
```bash
# 创建并切换到新分支
git checkout -b feature/new-theme-system

# 或使用新语法
git switch -c feature/new-theme-system
```

### 切换分支
```bash
git checkout main
# 或
git switch main
```

### 合并分支
```bash
# 切换到主分支
git checkout main

# 合并功能分支
git merge feature/new-theme-system

# 删除已合并的分支
git branch -d feature/new-theme-system
```

### 推送分支到远程
```bash
git push -u origin feature/new-theme-system
```

## 📋 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例
```bash
git commit -m "feat: 添加护眼主题模式"
git commit -m "fix: 修复移动端布局问题"
git commit -m "docs: 更新README安装说明"
git commit -m "style: 统一代码格式"
git commit -m "refactor: 重构主题系统架构"
git commit -m "perf: 优化图片加载性能"
git commit -m "test: 添加组件单元测试"
git commit -m "chore: 更新依赖版本"
```

## 🏷️ 版本标签管理

### 创建标签
```bash
# 创建轻量标签
git tag v1.0.0

# 创建带注释的标签（推荐）
git tag -a v1.0.0 -m "Release version 1.0.0

🎉 首个正式版本发布

✨ 主要功能:
- 完整的多主题系统
- 智能标签分类
- 响应式设计
- 用户友好的界面

🛠️ 技术改进:
- 性能优化
- 代码重构
- 测试覆盖率提升"
```

### 推送标签
```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

### 查看标签
```bash
# 列出所有标签
git tag

# 查看特定标签信息
git show v1.0.0
```

## 🔧 常用 Git 命令

### 查看历史
```bash
# 查看提交历史
git log

# 简洁格式
git log --oneline

# 图形化显示
git log --graph --oneline --all
```

### 撤销操作
```bash
# 撤销工作区更改
git checkout -- filename.tsx

# 撤销暂存区更改
git reset HEAD filename.tsx

# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1
```

### 远程仓库管理
```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add upstream https://github.com/original/repo.git

# 获取远程更新
git fetch origin

# 拉取并合并
git pull origin main
```

## 🚀 GitHub Actions 自动化

创建 `.github/workflows/ci.yml` 文件：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Run linting
      run: npm run lint
```

## 📊 项目维护

### 定期任务
1. **更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **清理分支**
   ```bash
   # 删除已合并的本地分支
   git branch --merged | grep -v main | xargs -n 1 git branch -d
   
   # 删除远程已删除的本地跟踪分支
   git remote prune origin
   ```

3. **备份重要分支**
   ```bash
   git push origin main:backup-main
   ```

## 🆘 常见问题解决

### 1. 推送被拒绝
```bash
# 先拉取远程更改
git pull origin main --rebase

# 然后推送
git push origin main
```

### 2. 合并冲突
```bash
# 查看冲突文件
git status

# 手动解决冲突后
git add .
git commit -m "resolve merge conflicts"
```

### 3. 忘记添加文件到 .gitignore
```bash
# 停止跟踪已提交的文件
git rm --cached filename

# 添加到 .gitignore
echo "filename" >> .gitignore

# 提交更改
git add .gitignore
git commit -m "chore: 添加文件到 .gitignore"
```

## 📚 学习资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方指南](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow 工作流](https://nvie.com/posts/a-successful-git-branching-model/)

---

这个指南涵盖了 PromptHUB 项目的完整 Git 和 GitHub 工作流程。如果遇到其他问题，请参考官方文档或在项目 Issues 中提问。