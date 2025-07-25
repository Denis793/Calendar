#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Checking deployment readiness...\n');

let errors = [];
let warnings = [];

try {
  // Check main package.json
  const mainPackage = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ Main package.json found');

  // Check server package.json
  const serverPackage = JSON.parse(readFileSync(join(__dirname, 'server', 'package.json'), 'utf8'));
  console.log('✅ Server package.json found');

  // Check for required scripts
  if (!mainPackage.scripts.build) {
    errors.push('❌ Missing "build" script in main package.json');
  } else {
    console.log('✅ Build script found');
  }

  if (!serverPackage.scripts.start) {
    errors.push('❌ Missing "start" script in server package.json');
  } else {
    console.log('✅ Server start script found');
  }

  // Check for render.yaml
  try {
    readFileSync(join(__dirname, 'render.yaml'), 'utf8');
    console.log('✅ render.yaml found');
  } catch {
    warnings.push('⚠️  render.yaml not found (optional for manual deployment)');
  }

  // Check for environment file
  try {
    readFileSync(join(__dirname, '.env.production'), 'utf8');
    console.log('✅ .env.production found');
  } catch {
    warnings.push('⚠️  .env.production not found');
  }

  // Check for gitignore
  try {
    readFileSync(join(__dirname, '.gitignore'), 'utf8');
    console.log('✅ .gitignore found');
  } catch {
    errors.push('❌ .gitignore not found');
  }

  console.log('\n📋 Summary:');

  if (errors.length > 0) {
    console.log('\n❌ Errors that must be fixed:');
    errors.forEach((error) => console.log(error));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach((warning) => console.log(warning));
  }

  if (errors.length === 0) {
    console.log('\n🎉 Project is ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Connect your repository to Render.com');
    console.log('3. Set up MongoDB Atlas database');
    console.log('4. Configure environment variables');
    console.log('5. Deploy!');
  } else {
    console.log('\n🔧 Please fix the errors above before deploying.');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking deployment readiness:', error.message);
  process.exit(1);
}
