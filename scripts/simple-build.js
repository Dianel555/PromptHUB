#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting simple build process...');

try {
  console.log('📦 Generating Prisma Client...');
  execSync('prisma generate', { stdio: 'inherit' });
  
  console.log('🏗️ Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}