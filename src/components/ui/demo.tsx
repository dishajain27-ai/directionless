'use client'

import { SpiralAnimation } from "@/components/ui/spiral-animation"
import { useState, useEffect } from 'react'

interface SpiralDemoProps {
  onEnter?: () => void;
}

export function SpiralDemo({ onEnter }: SpiralDemoProps) {
  const [startVisible, setStartVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  
  const handleEnter = () => {
    setIsExiting(true)
    // Wait for the slide-up animation to complete before triggering the callback
    setTimeout(() => {
      if (onEnter) {
        onEnter()
      } else {
        window.location.href = "https://xubh.top/"
      }
    }, 1200)
  }
  
  // Fade in the start button after animation loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`spiral-intro-overlay ${isExiting ? 'exit' : ''}`}>
      {/* Spiral Animation */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      {/* Simple Elegant Text Button with Pulsing Effect */}
      <div 
        className="spiral-enter-container"
        style={{
          opacity: startVisible ? 1 : 0,
          transform: `translate(-50%, ${startVisible ? '-50%' : '-40%'})`
        }}
      >
        <button 
          onClick={handleEnter}
          className="spiral-enter-btn"
        >
          Enter
        </button>
      </div>
    </div>
  )
}
