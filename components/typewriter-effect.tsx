"use client"

import { useEffect, useState } from "react"

interface TypewriterEffectProps {
  texts: string[]
  speed?: number
  deletionSpeed?: number
  delayBetweenTexts?: number
  className?: string
}

export function TypewriterEffect({
  texts,
  speed = 50,
  deletionSpeed = 30,
  delayBetweenTexts = 2000,
  className = "",
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, delayBetweenTexts)
      return () => clearTimeout(pauseTimer)
    }

    const currentText = texts[currentTextIndex]

    if (!isDeleting && currentIndex <= currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, currentIndex))
        setCurrentIndex(currentIndex + 1)

        // If we've reached the end of the text, pause before deleting
        if (currentIndex === currentText.length) {
          setIsPaused(true)
        }
      }, speed)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && currentIndex >= 0) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, currentIndex))
        setCurrentIndex(currentIndex - 1)

        // If we've deleted all text, move to the next text
        if (currentIndex === 0) {
          setIsDeleting(false)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }
      }, deletionSpeed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, currentTextIndex, delayBetweenTexts, deletionSpeed, isDeleting, isPaused, speed, texts])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  )
}
