/**
 * Test utility for daily randomizer
 * This file can be used to test the randomization functionality
 */

import { getDailySeed, getDailyRandomizedContent, getFallbackContent } from './dailyRandomizer';

// Test function to verify daily randomization
export const testDailyRandomization = () => {
  console.log('=== Daily Randomizer Test ===');
  
  // Test seed generation
  const seed = getDailySeed();
  console.log('Today\'s seed:', seed);
  
  // Test with sample data
  const sampleTrips = [
    { id: 1, title: 'Bromo Adventure', location: 'Malang', price: 750000, image: 'bromo.jpg' },
    { id: 2, title: 'Bali Paradise', location: 'Bali', price: 1200000, image: 'bali.jpg' },
    { id: 3, title: 'Yogya Heritage', location: 'Yogyakarta', price: 650000, image: 'yogya.jpg' }
  ];
  
  const sampleTravels = [
    { id: 1, origin: 'Jakarta', destination: 'Bandung', price_per_person: 150000, vehicle_type: 'Executive', image: 'jkt-bdg.jpg' },
    { id: 2, origin: 'Surabaya', destination: 'Malang', price_per_person: 120000, vehicle_type: 'VIP', image: 'sby-mlg.jpg' }
  ];
  
  // Test randomization
  const randomContent = getDailyRandomizedContent(sampleTrips, sampleTravels, 2);
  console.log('Randomized content:', randomContent);
  
  // Test fallback content
  const fallbackContent = getFallbackContent();
  console.log('Fallback content:', fallbackContent);
  
  console.log('=== Test Complete ===');
  
  return {
    seed,
    randomContent,
    fallbackContent
  };
};

// Export for use in development
if (typeof window !== 'undefined') {
  window.testDailyRandomization = testDailyRandomization;
}