# Nutri Scan App
Nutri-Scan: Chronic Care Assistant Track: Health Tech

Status: Fully Functional Prototype

Video Demo:https://youtu.be/dnw1_Gt8pNg

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

A Next.js application with OCR capabilities using Tesseract.js and smooth animations with Framer Motion.

## Features

- **Next.js 15** - Latest React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Tesseract.js** - OCR library for text extraction from images
- **Framer Motion** - Animation library for smooth UI interactions
- **TypeScript** - Type-safe development

## Getting Started

1. Install dependencies:
```bash
npm install --ignore-scripts
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload an image containing text
2. Click "Extract Text" to process the image with OCR
3. View the extracted text with smooth animations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Technologies

- Next.js 15.5.9
- React 18
- Tailwind CSS 3.4.0
- Tesseract.js 5.0.0
- Framer Motion 11.0.0
- TypeScript 5.x
