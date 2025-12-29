# Implementation Plan: Nutri-Scan App

## Overview

This implementation plan breaks down the Nutri-Scan app development into discrete, incremental tasks using Next.js, Tailwind CSS, and Tesseract.js. Each task builds on previous work to create a mobile-responsive web application for CKD and diabetes patients to scan nutrition labels.

## Tasks

- [ ] 1. Set up Next.js project structure and dependencies
  - Initialize Next.js 14 project with App Router
  - Install and configure Tailwind CSS for responsive design
  - Install Tesseract.js for OCR processing
  - Install fast-check for property-based testing
  - Set up TypeScript configuration with strict mode
  - Create basic project structure: components/, utils/, types/, __tests__/
  - Configure ESLint and Prettier for code quality
  - _Requirements: 8.5_

- [ ] 2. Implement core data models and types
  - [ ] 2.1 Create TypeScript interfaces for nutrition data
    - Define NutritionData, NutrientValue, and SafetyAnalysis interfaces
    - Create CameraError and OCRError type definitions  
    - Set up daily limits constants (sodium: 2300mg, potassium: 2000mg, sugar: 25000mg)
    - Create types/index.ts with all core type definitions
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 2.2 Write property test for data model validation
    - **Property 10: Unit normalization**
    - **Validates: Requirements 3.6**

- [ ] 3. Build Camera Interface component
import Tesseract from 'tesseract.js';
  - [ ] 3.1 Implement camera permission handling and preview
    - Create components/CameraInterface.tsx with getUserMedia integration
    - Handle camera permission requests and error states
    - Display live camera preview with proper aspect ratio
    - Implement rear camera selection by default
    - Add proper TypeScript types for camera functionality
    - _Requirements: 1.1, 1.2, 1.4, 6.4_

  - [ ] 3.2 Write property tests for camera functionality
    - **Property 1: Camera permission handling**
    - **Property 3: Default camera selection**  
    - **Property 19: Camera aspect ratio consistency**
    - **Validates: Requirements 1.2, 1.4, 6.4**

  - [ ] 3.3 Implement photo capture functionality
    - Add capture button with proper touch target sizing (44px minimum)
    - Capture photos optimized for OCR processing (high contrast, proper resolution)
    - Handle capture errors and retry mechanisms
    - Convert captured images to format suitable for Tesseract.js
    - _Requirements: 1.3, 6.6_

  - [ ] 3.4 Write property test for photo capture
    - **Property 2: Photo capture functionality**
    - **Validates: Requirements 1.3**

  - [-] 3.5 Write unit tests for camera error handling
    - Test permission denied scenarios
    - Test device not found scenarios
    - Test camera initialization failures
    - _Requirements: 1.5, 7.1_

- [ ] 4. Checkpoint - Camera functionality complete
  - Ensure camera component works across different devices
  - Verify responsive design on mobile and tablet
  - Ask the user if questions arise

- [ ] 5. Implement OCR Engine component
import Tesseract from 'tesseract.js';

export const scanImage = async (imageSrc: string) => {
  const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng');
  
  // Basic regex to find nutrient values
  const sodium = text.match(/Sodium\s*(\d+)mg/i)?.[1];
  const sugar = text.match(/Sugar\s*(\d+)g/i)?.[1];
  const potassium = text.match(/Potassium\s*(\d+)mg/i)?.[1];

  return {
    sodium: parseInt(sodium || '0'),
    sugar: parseInt(sugar || '0'),
    potassium: parseInt(potassium || '0')
  };
};
  - [ ] 5.1 Set up Tesseract.js integration
    - Create components/OCREngine.tsx with Tesseract.js worker initialization
    - Implement image preprocessing (grayscale, contrast enhancement, brightness adjustment)
    - Add progress tracking and loading states with proper UI feedback
    - Configure Tesseract.js with optimal settings for nutrition labels
    - _Requirements: 2.1, 2.5_

  - [ ] 5.2 Write property tests for OCR processing
    - **Property 4: OCR processing trigger**
    - **Property 5: OCR text extraction**
    - **Property 6: Loading state during OCR**
    - **Validates: Requirements 2.1, 2.2, 2.5**

  - [ ] 5.3 Implement OCR error handling and performance optimization
    - Add 10-second timeout for OCR processing
    - Handle poor image quality gracefully with user feedback
    - Implement retry mechanisms for failed processing
    - Optimize worker management for mobile performance
    - _Requirements: 2.3, 2.4, 8.1_

  - [ ] 5.4 Write property test for OCR performance
    - **Property 23: OCR performance**
    - **Validates: Requirements 8.1**

  - [ ] 5.5 Write unit tests for OCR error scenarios
    - Test OCR processing failures and timeout handling
    - Test image quality detection and user guidance
    - Test worker initialization and cleanup
    - _Requirements: 2.4, 7.2_

- [ ] 6. Build Nutrition Parser component
  - [ ] 6.1 Implement nutrient extraction logic
    - Create utils/nutritionParser.ts with regex patterns for sodium, potassium, and sugar detection
    - Parse values with units (mg, g) from OCR text using robust pattern matching
    - Handle multiple value formats and prioritize "per serving" values
    - Normalize all units to milligrams for consistent comparison
    - Add confidence scoring for extracted values
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ] 6.2 Write property tests for nutrition parsing
    - **Property 7: Comprehensive nutrient extraction**
    - **Property 8: Per-serving value selection**
    - **Property 10: Unit normalization**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

  - [ ] 6.3 Handle missing nutrients and edge cases
    - Mark nutrients as "not detected" when missing from OCR text
    - Handle malformed or unclear OCR text gracefully
    - Provide confidence scores and raw text references for extracted values
    - Add fallback parsing strategies for different label formats
    - _Requirements: 3.5_

  - [ ] 6.4 Write property test for missing nutrient handling
    - **Property 9: Missing nutrient handling**
    - **Validates: Requirements 3.5**

- [ ] 7. Implement Safety Analyzer component
  - [ ] 7.1 Create safety analysis logic
    - Create utils/safetyAnalyzer.ts with daily limit calculations
    - Calculate percentage of daily limits per serving for each nutrient
    - Implement 25% threshold for high-risk classification logic
    - Generate overall safety status (safe/high-risk) based on all nutrients
    - Create user-friendly explanations for each nutrient analysis
    - _Requirements: 4.4, 4.5, 4.6, 5.5_

  - [ ] 7.2 Write property tests for safety analysis
    - **Property 11: Daily limit percentage calculation**
    - **Property 12: High-risk classification**
    - **Property 13: Safe classification**
    - **Validates: Requirements 4.4, 4.5, 4.6**

  - [ ] 7.3 Write unit tests for daily limit constants
    - Test sodium limit (2300mg) calculations
    - Test potassium limit (2000mg) calculations
    - Test sugar limit (25000mg) calculations
    - Test edge cases around 25% threshold
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8. Build Status Display component
  - [ ] 8.1 Create visual status indicators
    - Create components/StatusDisplay.tsx with green/red status indicators
    - Display nutrient values and percentages with clear formatting
    - Show clear explanations for high-risk items with patient-friendly language
    - Ensure readability on small screens with responsive typography
    - Add loading states and smooth transitions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.5_

  - [ ] 8.2 Write property tests for status display
    - **Property 14: Status indicator display**
    - **Property 15: Nutrient value display**
    - **Property 16: High-risk explanations**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

  - [ ] 8.3 Add retry and manual entry options
    - Implement "Retake Photo" functionality with proper state management
    - Add manual nutrient entry form as fallback option
    - Ensure fast rendering (under 1 second) with performance optimization
    - Add proper form validation for manual entry
    - _Requirements: 7.3, 8.2_

  - [ ] 8.4 Write property test for UI performance
    - **Property 24: UI rendering performance**
    - **Validates: Requirements 8.2**

- [ ] 9. Checkpoint - Core functionality complete
  - Test complete OCR to analysis workflow
  - Verify all components work together
  - Ask the user if questions arise

- [ ] 10. Implement responsive design and mobile optimization
  - [ ] 10.1 Create mobile-first responsive layouts
    - Implement responsive design for 320px-1024px screens using Tailwind CSS
    - Handle orientation changes gracefully with CSS media queries
    - Optimize touch interactions and button sizing (minimum 44px targets)
    - Test layouts across different device sizes and orientations
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

  - [ ] 10.2 Write property tests for responsive design
    - **Property 17: Responsive design**
    - **Property 18: Orientation handling**
    - **Property 20: Touch target sizing**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.6**

  - [ ] 10.3 Optimize for mobile performance
    - Ensure UI responsiveness during OCR processing with proper loading states
    - Optimize image processing for mobile devices (memory and CPU constraints)
    - Implement smooth camera preview with minimal lag
    - Add performance monitoring and optimization
    - _Requirements: 8.3, 8.4_

  - [ ] 10.4 Write property test for UI responsiveness
    - **Property 25: UI responsiveness during processing**
    - **Validates: Requirements 8.3**

- [ ] 11. Add comprehensive error handling
  - [ ] 11.1 Implement global error boundaries
    - Create error boundary components for graceful failure handling
    - Add user-friendly error messages throughout the app with clear recovery instructions
    - Implement recovery options for all error states (retry, manual entry, etc.)
    - Add error logging and reporting for debugging
    - _Requirements: 7.5_

  - [ ] 11.2 Write property test for error recovery
    - **Property 22: Error recovery**
    - **Validates: Requirements 7.5**

  - [ ] 11.3 Ensure offline functionality
    - Verify core features work without internet connection (Tesseract.js runs client-side)
    - Test Tesseract.js offline capabilities and worker management
    - Handle network failures gracefully with appropriate user feedback
    - Implement service worker for offline asset caching
    - _Requirements: 7.4_

  - [ ] 11.4 Write property test for offline functionality
    - **Property 21: Offline functionality**
    - **Validates: Requirements 7.4**

  - [ ] 11.5 Write unit tests for specific error scenarios
    - Test camera permission errors and recovery flows
    - Test OCR failure handling and user guidance
    - Test manual entry fallback functionality
    - Test network failure scenarios
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 12. Final integration and testing
  - [ ] 12.1 Create main app layout and routing
    - Set up Next.js App Router structure with app/page.tsx as main entry point
    - Create main page with camera-first interface and intuitive user flow
    - Integrate all components into cohesive user experience
    - Ensure no authentication requirements (anonymous access)
    - Add proper SEO meta tags and accessibility features
    - _Requirements: 8.5_

  - [ ] 12.2 Write integration tests
    - Test complete user workflow from camera to results
    - Verify component interactions and data flow
    - Test error recovery flows and user guidance
    - Test cross-browser compatibility

  - [ ] 12.3 Performance optimization and final testing
    - Optimize bundle size and loading performance with Next.js optimization features
    - Test across different mobile devices and browsers (iOS Safari, Chrome, Firefox)
    - Verify accessibility requirements (WCAG compliance, screen readers)
    - Final validation of all requirements with comprehensive testing
    - Add performance monitoring and analytics

- [ ] 13. Final checkpoint - Complete application
  - Ensure all tests pass and requirements are met
  - Verify mobile responsiveness across devices
  - Test complete user workflows
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP development
- Each task references specific requirements for traceability and validation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and user feedback
- All tasks assume no existing codebase - this is a fresh Next.js project setup
- Focus on mobile-first development with responsive design principles
- Prioritize offline functionality and performance optimization for mobile devices