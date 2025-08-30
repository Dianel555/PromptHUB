#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 验证导入路径...');

// 检查关键组件是否存在
const componentsToCheck = [
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/separator.tsx'
];

let allGood = true;

componentsToCheck.forEach(componentPath => {
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${componentPath} 存在`);
  } else {
    console.log(`❌ ${componentPath} 不存在`);
    allGood = false;
  }
});

// 检查 tsconfig.json 路径配置
const tsconfigPath = 'tsconfig.json';
if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
    console.log('✅ tsconfig.json 路径别名配置正确');
  } else {
    console.log('❌ tsconfig.json 路径别名配置有问题');
    allGood = false;
  }
} else {
  console.log('❌ tsconfig.json 不存在');
  allGood = false;
}

if (allGood) {
  console.log('🎉 所有导入路径验证通过！');
  process.exit(0);
} else {
  console.log('💥 发现导入路径问题！');
  process.exit(1);
}