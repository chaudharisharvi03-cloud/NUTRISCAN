Nutri-Scan: Chronic Care Assistant Track: Health Tech

Status: Fully Functional Prototype 

Video Demo:

The Problem Patients managing Chronic Kidney Disease (CKD) and Diabetes face a daily struggle with "Hidden Killers"—Sodium, Potassium, and Sugar hidden in processed foods.

Tiny Labels: Nutrition facts are often printed in fonts too small for many elderly patients to read.

Complex Data: Patients have to manually calculate if a single serving fits into their strict daily allowance.

The Risk: One high-sodium meal can lead to fluid retention or blood pressure spikes for CKD patients.

The Solution Nutri-Scan is a mobile-first web application that empowers patients to make safe dietary choices in seconds.

OCR Engine: Uses Computer Vision to extract nutritional data from physical labels.

Medical Logic: Automatically cross-references values against established CKD and Diabetes safety thresholds.

Instant Feedback: Provides a color-coded (Red/Green) safety rating so patients don't have to guess.

Technical Architecture Frontend: Next.js 15, Tailwind CSS, Framer Motion (for smooth UI).

OCR Engine: Tesseract.js (running in a web worker for performance).

Logic: Custom TypeScript utility engine for threshold evaluation.

Deployment: Vercel (CI/CD pipeline).

Engineering Principles Applied Modular Code: Separated OCR logic from UI components to ensure maintainability.

Accessibility: High-contrast UI and large font sizes designed specifically for health-tech users.

Performance: Implemented client-side image processing to reduce server load and latency.
