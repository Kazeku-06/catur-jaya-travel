#!/usr/bin/env node

// Test script for date helper functions
// Run with: node test_date_helpers.js

import { formatDate, formatRelativeTime } from './src/utils/helpers.js';

console.log('=== Testing Date Helper Functions ===\n');

// Test cases for formatDate
const testCases = [
  { input: '2024-01-15T10:30:00Z', description: 'Valid ISO date' },
  { input: '2024-01-15', description: 'Valid date string' },
  { input: new Date(), description: 'Date object' },
  { input: null, description: 'null value' },
  { input: undefined, description: 'undefined value' },
  { input: '', description: 'empty string' },
  { input: 'invalid-date', description: 'invalid date string' },
  { input: 'not-a-date', description: 'non-date string' },
  { input: 0, description: 'zero timestamp' },
  { input: NaN, description: 'NaN value' }
];

console.log('Testing formatDate function:');
console.log('================================');

testCases.forEach(({ input, description }) => {
  try {
    const result = formatDate(input);
    console.log(`✓ ${description.padEnd(20)}: "${input}" → "${result}"`);
  } catch (error) {
    console.log(`✗ ${description.padEnd(20)}: "${input}" → ERROR: ${error.message}`);
  }
});

console.log('\nTesting formatRelativeTime function:');
console.log('====================================');

testCases.forEach(({ input, description }) => {
  try {
    const result = formatRelativeTime(input);
    console.log(`✓ ${description.padEnd(20)}: "${input}" → "${result}"`);
  } catch (error) {
    console.log(`✗ ${description.padEnd(20)}: "${input}" → ERROR: ${error.message}`);
  }
});

console.log('\n=== Date Helper Tests Complete ===');
console.log('All functions should now handle invalid dates gracefully!');