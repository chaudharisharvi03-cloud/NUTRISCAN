'use client'
import { motion } from 'framer-motion'
import OCRDemo from './components/OCRDemo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Nutri Scan App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            OCR-powered nutrition scanning with Tesseract.js and beautiful animations with Framer Motion
          </p>
        </motion.div>

        <OCRDemo />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Technologies Used
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js 15', 'Tailwind CSS', 'Tesseract.js', 'Framer Motion', 'TypeScript'].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white px-4 py-2 rounded-full shadow-md text-gray-700 font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}