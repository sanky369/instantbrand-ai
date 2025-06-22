#!/usr/bin/env node

/**
 * Test script to verify the InstantBrand AI setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 InstantBrand AI Setup Verification\n');

// Check frontend structure
const frontendChecks = [
  'package.json',
  'app/page.tsx',
  'app/layout.tsx',
  'components/brand-generator.tsx',
  'lib/api.ts',
  'CLAUDE.md',
  '.env.example'
];

console.log('📁 Frontend Structure:');
frontendChecks.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check backend structure
const backendChecks = [
  'backend/main.py',
  'backend/requirements.txt',
  'backend/models.py',
  'backend/orchestrator.py',
  'backend/.env.example',
  'backend/README.md',
  'backend/agents/brand_director.py',
  'backend/agents/visual_creator.py',
  'backend/agents/social_media_agent.py',
  'backend/agents/video_creator.py',
  'backend/services/fal_service.py',
  'backend/api/routes.py'
];

console.log('\n🐍 Backend Structure:');
backendChecks.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json scripts
console.log('\n📦 Available Scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  Object.entries(packageJson.scripts || {}).forEach(([script, command]) => {
    console.log(`  📜 npm run ${script} - ${command}`);
  });
} catch (error) {
  console.log('  ❌ Could not read package.json');
}

// Setup instructions
console.log('\n🔧 Next Steps:');
console.log('  1. Frontend Setup:');
console.log('     npm install');
console.log('     npm run dev');
console.log('');
console.log('  2. Backend Setup (in a new terminal):');
console.log('     cd backend/');
console.log('     python3 -m venv venv');
console.log('     source venv/bin/activate  # On Windows: venv\\Scripts\\activate');
console.log('     pip install -r requirements.txt');
console.log('     cp .env.example .env');
console.log('     # Add your API keys to .env');
console.log('     uvicorn main:app --reload');
console.log('');
console.log('  3. Environment Configuration:');
console.log('     - Get Google Gemini API key: https://aistudio.google.com/app/apikey');
console.log('     - Get FAL AI API key: https://fal.ai/dashboard');
console.log('     - Update backend/.env with your keys');
console.log('');
console.log('  4. Test the Integration:');
console.log('     - Frontend: http://localhost:3000');
console.log('     - Backend: http://localhost:8000');
console.log('     - API Docs: http://localhost:8000/docs');
console.log('');
console.log('✨ You\'re all set! Happy building!');