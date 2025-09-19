"use client"

import { useState, useEffect, useCallback } from "react"

export type FacialEmotion = "happy" | "sad" | "stressed" | "neutral" | "focused" | "tired"
export type VoiceTone = "calm" | "energetic" | "tired" | "anxious" | "excited" | "neutral"

export interface EmotionData {
  facial: FacialEmotion
  voice: VoiceTone
  confidence: number
  timestamp: Date
}

export interface EmotionDetectionState {
  currentEmotion: EmotionData
  emotionHistory: EmotionData[]
  isAnalyzing: boolean
  demoMode: boolean
}

const FACIAL_EMOTIONS: FacialEmotion[] = ["happy", "sad", "stressed", "neutral", "focused", "tired"]
const VOICE_TONES: VoiceTone[] = ["calm", "energetic", "tired", "anxious", "excited", "neutral"]

// Simulated emotion detection with realistic patterns
const getRandomEmotion = (): EmotionData => {
  // Weight emotions to be more realistic (more neutral/focused states for astronauts)
  const weightedFacialEmotions: FacialEmotion[] = [
    "neutral",
    "neutral",
    "neutral",
    "focused",
    "focused",
    "happy",
    "stressed",
    "tired",
    "sad",
  ]

  const weightedVoiceTones: VoiceTone[] = [
    "calm",
    "calm",
    "neutral",
    "neutral",
    "energetic",
    "tired",
    "anxious",
    "excited",
  ]

  return {
    facial: weightedFacialEmotions[Math.floor(Math.random() * weightedFacialEmotions.length)],
    voice: weightedVoiceTones[Math.floor(Math.random() * weightedVoiceTones.length)],
    confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
    timestamp: new Date(),
  }
}

export function useEmotionDetection() {
  const [state, setState] = useState<EmotionDetectionState>({
    currentEmotion: {
      facial: "neutral",
      voice: "neutral",
      confidence: 0.8,
      timestamp: new Date(),
    },
    emotionHistory: [],
    isAnalyzing: false,
    demoMode: false,
  })

  const analyzeEmotion = useCallback(() => {
    setState((prev) => ({ ...prev, isAnalyzing: true }))

    // Simulate analysis delay
    setTimeout(() => {
      const newEmotion = getRandomEmotion()

      setState((prev) => ({
        ...prev,
        currentEmotion: newEmotion,
        emotionHistory: [newEmotion, ...prev.emotionHistory].slice(0, 10), // Keep last 10
        isAnalyzing: false,
      }))
    }, 1500)
  }, [])

  const toggleDemoMode = useCallback(() => {
    setState((prev) => ({ ...prev, demoMode: !prev.demoMode }))
  }, [])

  const startContinuousAnalysis = useCallback(() => {
    const interval = setInterval(() => {
      if (state.demoMode) {
        analyzeEmotion()
      }
    }, 5000) // Analyze every 5 seconds in demo mode

    return () => clearInterval(interval)
  }, [state.demoMode, analyzeEmotion])

  useEffect(() => {
    if (state.demoMode) {
      const cleanup = startContinuousAnalysis()
      return cleanup
    }
  }, [state.demoMode, startContinuousAnalysis])

  return {
    ...state,
    analyzeEmotion,
    toggleDemoMode,
  }
}
