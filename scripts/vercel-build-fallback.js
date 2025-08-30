#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔄 Running fallback Vercel build...');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('prisma generate', { stdio: 'inherit' });
  
  // Try database operations but don't fail if they error
  console.log('🗄️  Attempting database operations...');
  try {
    execSync('prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Database operations completed');
  } catch (dbError) {
    console.log('⚠️  Database operations failed, continuing without them...');
  }
  
  // Build Next.js app
  console.log('🏗️  Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('✅ Fallback build completed successfully!');
} catch (error) {
  console.error('❌ Fallback build failed:', error.message);
  process.exit(1);
}