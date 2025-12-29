# Requirements Document

## Introduction

Nutri-Scan is a mobile-responsive web application designed to help patients with chronic kidney disease (CKD) and diabetes make informed dietary choices. The application uses optical character recognition (OCR) to scan nutrition labels and provides immediate feedback on whether food items are safe based on their sodium, potassium, and sugar content.

## Glossary

- **Nutri_Scan_App**: The complete web application system
- **OCR_Engine**: The optical character recognition component using Tesseract.js
- **Nutrition_Parser**: Component that extracts sodium, potassium, and sugar values from OCR text
- **Safety_Analyzer**: Component that compares nutrition values against safe daily limits
- **Camera_Interface**: Component that handles camera access and image capture
- **Status_Display**: Component that shows red/green status and explanations
- **CKD_Patient**: User with chronic kidney disease
- **Diabetes_Patient**: User with diabetes
- **Nutrition_Label**: Food packaging label containing nutritional information
- **Safe_Daily_Limits**: Maximum recommended daily intake values for sodium, potassium, and sugar

## Requirements

### Requirement 1: Camera Integration and Image Capture

**User Story:** As a CKD/diabetes patient, I want to use my device's camera to capture nutrition labels, so that I can quickly assess food safety without manual data entry.

#### Acceptance Criteria

1. WHEN a user accesses the application, THE Nutri_Scan_App SHALL request camera permissions
2. WHEN camera permissions are granted, THE Camera_Interface SHALL display a live camera preview
3. WHEN a user taps the capture button, THE Camera_Interface SHALL take a photo of the nutrition label
4. WHEN the device has multiple cameras, THE Camera_Interface SHALL use the rear-facing camera by default
5. IF camera access is denied, THEN THE Nutri_Scan_App SHALL display an error message and provide instructions for enabling camera access

### Requirement 2: Optical Character Recognition

**User Story:** As a CKD/diabetes patient, I want the app to automatically read nutrition labels from photos, so that I don't have to manually type nutritional information.

#### Acceptance Criteria

1. WHEN a nutrition label photo is captured, THE OCR_Engine SHALL process the image using Tesseract.js
2. WHEN OCR processing completes, THE OCR_Engine SHALL return extracted text from the nutrition label
3. WHEN the image quality is poor, THE OCR_Engine SHALL attempt processing and return available text
4. WHEN OCR processing fails, THE Nutri_Scan_App SHALL display an error message and allow retaking the photo
5. WHILE OCR processing is active, THE Nutri_Scan_App SHALL display a loading indicator

### Requirement 3: Nutrition Data Parsing

**User Story:** As a CKD/diabetes patient, I want the app to identify sodium, potassium, and sugar values from nutrition labels, so that I can focus on the nutrients that matter most for my conditions.

#### Acceptance Criteria

1. WHEN OCR text is received, THE Nutrition_Parser SHALL extract sodium values and units (mg, g)
2. WHEN OCR text is received, THE Nutrition_Parser SHALL extract potassium values and units (mg, g)
3. WHEN OCR text is received, THE Nutrition_Parser SHALL extract sugar values and units (mg, g)
4. WHEN multiple values are found for the same nutrient, THE Nutrition_Parser SHALL use the "per serving" value
5. WHEN a nutrient value cannot be found, THE Nutrition_Parser SHALL mark that nutrient as "not detected"
6. THE Nutrition_Parser SHALL normalize all values to milligrams for consistent comparison

### Requirement 4: Safety Analysis and Limits

**User Story:** As a CKD/diabetes patient, I want the app to compare nutrition values against safe daily limits, so that I can make informed decisions about food consumption.

#### Acceptance Criteria

1. THE Safety_Analyzer SHALL use 2300mg as the daily sodium limit for CKD patients
2. THE Safety_Analyzer SHALL use 2000mg as the daily potassium limit for CKD patients  
3. THE Safety_Analyzer SHALL use 25g (25000mg) as the daily sugar limit for diabetes patients
4. WHEN analyzing a food item, THE Safety_Analyzer SHALL calculate the percentage of daily limit per serving
5. WHEN any nutrient exceeds 25% of daily limit per serving, THE Safety_Analyzer SHALL mark the item as "high risk"
6. WHEN all nutrients are below 25% of daily limit per serving, THE Safety_Analyzer SHALL mark the item as "safe"

### Requirement 5: Status Display and User Feedback

**User Story:** As a CKD/diabetes patient, I want clear visual feedback about food safety, so that I can quickly understand whether a food item is appropriate for my diet.

#### Acceptance Criteria

1. WHEN a food item is marked as "safe", THE Status_Display SHALL show a green status indicator
2. WHEN a food item is marked as "high risk", THE Status_Display SHALL show a red status indicator
3. WHEN displaying status, THE Status_Display SHALL show the specific nutrient values found
4. WHEN displaying status, THE Status_Display SHALL show the percentage of daily limit for each nutrient
5. WHEN a nutrient is marked as "high risk", THE Status_Display SHALL explain which nutrient(s) exceed safe limits
6. THE Status_Display SHALL provide simple explanations suitable for patients without medical training

### Requirement 6: Mobile Responsive Design

**User Story:** As a CKD/diabetes patient, I want the app to work well on my mobile device, so that I can use it while grocery shopping or meal planning.

#### Acceptance Criteria

1. THE Nutri_Scan_App SHALL display properly on mobile devices with screen widths from 320px to 768px
2. THE Nutri_Scan_App SHALL display properly on tablet devices with screen widths from 768px to 1024px
3. WHEN the device orientation changes, THE Nutri_Scan_App SHALL adapt the layout appropriately
4. THE Camera_Interface SHALL maintain proper aspect ratio across different screen sizes
5. THE Status_Display SHALL remain readable and accessible on small screens
6. WHEN using touch interactions, THE Nutri_Scan_App SHALL provide appropriate touch targets (minimum 44px)

### Requirement 7: Error Handling and User Guidance

**User Story:** As a CKD/diabetes patient, I want helpful error messages and guidance, so that I can successfully use the app even when things don't work perfectly.

#### Acceptance Criteria

1. WHEN camera access fails, THE Nutri_Scan_App SHALL display clear instructions for enabling camera permissions
2. WHEN OCR fails to detect text, THE Nutri_Scan_App SHALL suggest retaking the photo with better lighting
3. WHEN nutrition values cannot be parsed, THE Nutri_Scan_App SHALL allow manual entry of values
4. WHEN the device is offline, THE Nutri_Scan_App SHALL continue to function for core OCR and analysis features
5. WHEN an unexpected error occurs, THE Nutri_Scan_App SHALL display a user-friendly error message and recovery options

### Requirement 8: Performance and Usability

**User Story:** As a CKD/diabetes patient, I want the app to work quickly and smoothly, so that I can efficiently check multiple food items while shopping.

#### Acceptance Criteria

1. WHEN processing a nutrition label, THE OCR_Engine SHALL complete analysis within 10 seconds on typical mobile devices
2. WHEN displaying results, THE Status_Display SHALL render within 1 second after analysis completion
3. THE Nutri_Scan_App SHALL maintain responsive user interface during OCR processing
4. THE Camera_Interface SHALL provide smooth preview with minimal lag
5. THE Nutri_Scan_App SHALL work without requiring user registration or login