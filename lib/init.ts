import { seedGames } from './seedGames';

let isInitialized = false;

/**
 * Initialize the application - seeds database if needed
 */
export async function initializeApp() {
  if (isInitialized) return;
  
  console.log('Initializing application...');
  
  // Seed games data if needed
  await seedGames();
  
  isInitialized = true;
  console.log('Application initialization complete');
}

// Call the initialization function
initializeApp().catch(err => {
  console.error('Failed to initialize application:', err);
}); 