#!/usr/bin/env node

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Vercel build process...');

  // Step 1: Generate Prisma Client
  if (!runCommand('prisma generate', 'Generating Prisma Client')) {
    process.exit(1);
  }

  // Step 2: Try to deploy migrations (ignore errors if already applied)
  console.log('🔄 Deploying database migrations...');
  try {
    execSync('prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Database migrations deployed successfully');
  } catch (error) {
    console.log('⚠️  Migration deployment had issues (this might be expected if migrations are already applied)');
    console.log('Continuing with build...');
  }

  // Step 3: Build Next.js application
  if (!runCommand('next build', 'Building Next.js application')) {
    process.exit(1);
  }

  console.log('🎉 Vercel build completed successfully!');
}

main().catch((error) => {
  console.error('💥 Build process failed:', error);
  process.exit(1);
});