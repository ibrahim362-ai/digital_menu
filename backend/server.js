// Entry point for the backend server
// This file can be used to start the server from the root directory

import('./src/app.js')
  .then(() => {
    console.log('✅ Server started successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
