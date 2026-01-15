#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// 检查文件/目录是否应该被排除（支持简单的 glob 模式）
function shouldExclude(name, excludeList) {
  for (const pattern of excludeList) {
    // 精确匹配
    if (pattern === name) {
      return true;
    }
    // 支持简单的 glob 模式：*.ext
    if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1); // 获取 .ext
      if (name.endsWith(ext)) {
        return true;
      }
    }
  }
  return false;
}

// 复制文件和目录的函数
function copySync(src, dest, exclude = []) {
  const stats = fs.statSync(src);
  const basename = path.basename(src);

  // 检查是否需要排除（对文件和目录都进行检查）
  if (shouldExclude(basename, exclude)) {
    return;
  }

  if (stats.isDirectory()) {
    // 创建目标目录
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    // 复制目录中的所有文件（包括隐藏文件）
    const files = fs.readdirSync(src, { withFileTypes: true });
    for (const file of files) {
      const srcPath = path.join(src, file.name);
      const destPath = path.join(dest, file.name);
      copySync(srcPath, destPath, exclude);
    }
  } else {
    // 确保目标目录存在
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    // 复制文件
    fs.copyFileSync(src, dest);
    // console.log(`📄 复制文件: ${src} -> ${dest}`); // 调试日志：确认隐藏文件被复制
  }
}

async function init() {
  console.log('\n🚀 Vue 3 + TypeScript + Vite 脚手架初始化\n');

  const projectName = (await question('请输入项目名称 (默认: my-project): ')) || 'my-project';
  const projectDescription =
    (await question('请输入项目描述 (默认: Vue 3 + TypeScript + Vite 前端项目): ')) ||
    'Vue 3 + TypeScript + Vite 前端项目';
  const projectAuthor = (await question('请输入作者名称 (默认: Your Name): ')) || 'Your Name';

  console.log('\n正在创建项目...\n');

  // 获取当前目录
  const currentDir = process.cwd();
  // 获取脚手架根目录（即 fast-scaff-fe 目录）
  const scaffRootDir = path.join(__dirname, '..');
  // 额外校验：检查脚手架根目录是否存在关键隐藏文件（如 .gitignore）
  const gitignorePath = path.join(scaffRootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    console.error(`❌ 错误：脚手架根目录缺失关键隐藏文件 .gitignore，路径：${scaffRootDir}`);
    rl.close();
    process.exit(1);
  }
  // 新项目的目标目录
  const targetDir = path.join(currentDir, projectName);

  // 检查目标目录是否已存在
  if (fs.existsSync(targetDir)) {
    console.error(`❌ 错误：目录 "${projectName}" 已存在`);
    rl.close();
    process.exit(1);
  }

  // 要排除的文件和目录
  const excludeList = ['node_modules', '.git', 'dist', 'dist-ssr', '*.local', 'logs', 'coverage', '.DS_Store', '*.log', '.npmignore', '.vscode', 'pnpm-lock.yaml'];

  try {
    // 复制脚手架文件到新目录
    copySync(scaffRootDir, targetDir, excludeList);

      // 校验关键隐藏文件是否存在
    const criticalHiddenFiles = ['.gitignore', '.eslintrc.js', '.prettierrc'];
    criticalHiddenFiles.forEach(file => {
      const filePath = path.join(targetDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ 警告：关键隐藏文件 ${file} 未复制成功`);
      }
    });


    // 更新 package.json
    const packageJsonPath = path.join(targetDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = projectName;
    packageJson.description = projectDescription;
    packageJson.author = projectAuthor;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

    // 更新 index.html
    const indexHtmlPath = path.join(targetDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      indexHtml = indexHtml.replace(/<title>.*?<\/title>/, `<title>${projectName}</title>`);
      fs.writeFileSync(indexHtmlPath, indexHtml);
    }

    console.log('✅ 项目创建完成！\n');
    console.log('📝 项目信息:');
    console.log(`   名称: ${projectName}`);
    console.log(`   路径: ${targetDir}`);
    console.log(`   描述: ${projectDescription}`);
    console.log(`   作者: ${projectAuthor}\n`);
    console.log('� 安装依赖:');
    console.log(`   cd ${projectName}`);
    console.log('   pnpm install\n');
    console.log('🚀 启动开发服务器:');
    console.log('   pnpm dev\n');
    console.log('📄 查看项目文档:');
    console.log('   README.md\n');
  } catch (error) {
    console.error(`❌ 创建项目时发生错误: ${error.message}`);
    // 清理可能创建的目录
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  } finally {
    rl.close();
  }
}

init();
