/**
 * Test script for daily randomizer functionality
 * Run this to verify the daily randomization is working correctly
 */

import { getDailySeed, getDailyRandomizedContent, getFallbackContent } from './dailyRandomizer.js';

// Test data
const sampleTrips = [
  { id: 1, title: 'Bromo Adventure', location: 'Malang', price: 750000 },
  { id: 2, title: 'Tumpak Sewu', location: 'Lumajang', price: 650000 },
  { id: 3, title: 'Ijen Crater', location: 'Banyuwangi', price: 850000 }
];

const sampleTravels = [
  { id: 1, origin: 'Jakarta', destination: 'Bandung', price_per_person: 150000 },
  { id: 2, origin: 'Surabaya', destination: 'Malang', price_per_person: 120000 }
];

// Test functions
export const testDailyRandomizer = () => {
  console.log('=== Daily Randomizer Test ===');
  
  // Test 1: Daily seed consistency
  const seed1 = getDailySeed();
  const seed2 = getDailySeed();
  console.log('Seed consistency test:', seed1 === seed2 ? 'PASS' : 'FAIL');
  console.log('Today\'s seed:', seed1);
  
  // Test 2: Content generation with real data
  const dailyContent = getDailyRandomizedContent(sampleTrips, sampleTravels, 2);
  console.log('\nDaily content generated:');
  dailyContent.forEach((item, index) => {
    console.log(`${index + 1}. ${item.type.toUpperCase()}: ${item.displayName}`);
    console.log(`   Link: ${item.detailLink}`);
    console.log(`   Price: ${item.displayPrice}`);
  });
  
  // Test 3: Fallback content
  const fallbackContent = getFallbackContent();
  console.log('\nFallback content:');
  fallbackContent.forEach((item, index) => {
    console.log(`${index + 1}. ${item.type.toUpperCase()}: ${item.displayName}`);
    console.log(`   Link: ${item.detailLink}`);
  });
  
  // Test 4: Consistency check (same seed should produce same results)
  const content1 = getDailyRandomizedContent(sampleTrips, sampleTravels, 2);
  const content2 = getDailyRandomizedContent(sampleTrips, sampleTravels, 2);
  const isConsistent = JSON.stringify(content1) === JSON.stringify(content2);
  console.log('\nConsistency test:', isConsistent ? 'PASS' : 'FAIL');
  
  return {
    seed: seed1,
    dailyContent,
    fallbackContent,
    isConsistent
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testDailyRandomizer = testDailyRandomizer;
}