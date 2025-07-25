#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import process from 'process';

const execAsync = promisify(exec);

console.log('🚀 Testing full-stack build locally...\n');

async function testBuild() {
  try {
    console.log('📦 Building frontend...');
    await execAsync('npm run build');
    console.log('✅ Frontend build completed\n');

    console.log('📦 Installing server dependencies...');
    await execAsync('cd server && npm install');
    console.log('✅ Server dependencies installed\n');

    console.log('🎯 Testing production build locally...');
    console.log('Setting NODE_ENV=production...');
    
    // Start server with production environment
    const serverProcess = exec('cross-env NODE_ENV=production npm run server:start');
    
    serverProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    // Wait a bit for server to start
    setTimeout(() => {
      console.log('\n🌐 Server should be running at: http://localhost:3002');
      console.log('📱 Frontend should be served from: http://localhost:3002');
      console.log('🔌 API endpoints available at: http://localhost:3002/api/*');
      console.log('\nPress Ctrl+C to stop the server');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error during build test:', error.message);
    process.exit(1);
  }
}

testBuild();
