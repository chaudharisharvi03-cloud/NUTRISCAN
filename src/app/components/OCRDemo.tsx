'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Tesseract from 'tesseract.js'

export default function OCRDemo() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setExtractedText('')
    }
  }

  const processImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const result = await Tesseract.recognize(selectedImage, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })
      
      setExtractedText(result.data.text)
    } catch (error) {
      console.error('OCR Error:', error)
      setExtractedText('Error processing image')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-6 text-center text-gray-800"
      >
        OCR Text Extraction Demo
      </motion.h2>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            {selectedImage ? selectedImage.name : 'Click to select an image'}
          </label>
        </motion.div>

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="max-w-full h-auto rounded-lg mx-auto"
              style={{ maxHeight: '300px' }}
            />
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={processImage}
          disabled={!selectedImage || isProcessing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? `Processing... ${progress}%` : 'Extract Text'}
        </motion.button>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-gray-200 rounded-full h-2"
          >
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}

        {extractedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 p-4 bg-gray-100 rounded-lg"
          >
            <h3 className="font-semibold mb-2">Extracted Text:</h3>
            <p className="whitespace-pre-wrap text-sm">{extractedText}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}