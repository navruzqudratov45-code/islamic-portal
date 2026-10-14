const fs = require('fs');

// Papkalarni yaratish
if (!fs.existsSync('src')) fs.mkdirSync('src');
if (!fs.existsSync('public')) fs.mkdirSync('public');

// package.json faylini yaratish
fs.writeFileSync('package.json', JSON.stringify({
  "name": "islamic-portal",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": { 
    "cors": "^2.8.5", 
    "express": "^4.19.2" 
  },
  "devDependencies": { 
    "@types/cors": "^2.8.17", 
    "@types/express": "^4.17.21", 
    "@types/node": "^20.12.7", 
    "ts-node-dev": "^2.0.0", 
    "typescript": "^5.4.5" 
  }
}, null, 2));

// tsconfig.json faylini yaratish
fs.writeFileSync('tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "ES2022", 
    "module": "CommonJS", 
    "rootDir": "./src", 
    "outDir": "./dist",
    "strict": true, 
    "esModuleInterop": true, 
    "skipLibCheck": true, 
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}, null, 2));

console.log("Barcha papka va konfiguratsiya fayllari muvaffaqiyatli yaratildi!");