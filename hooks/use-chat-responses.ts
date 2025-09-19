"use client"

import { useState, useEffect } from "react"
import { useEmotionDetection, type FacialEmotion, type VoiceTone } from "./use-emotion-detection"

export interface ChatMessage {
  id: string
  message: string
  type: "support" | "suggestion" | "alert" | "info"
  timestamp: Date
  emotion?: FacialEmotion
  voiceTone?: VoiceTone
}

const getEmotionResponse = (facial: FacialEmotion, voice: VoiceTone): ChatMessage => {
  const responses = {
    // Happy responses
    happy: {
      calm: "You're radiating positive energy! This is a great time to tackle challenging tasks.",
      energetic: "Your enthusiasm is wonderful! Channel this energy into your mission objectives.",
      neutral: "I can see you're feeling good. Keep up the excellent work!",
      tired: "You seem happy but a bit tired. Consider taking a short break to recharge.",
      anxious: "You appear happy but I sense some underlying tension. Let's do a quick breathing exercise.",
      excited: "Your excitement is contagious! Make sure to stay focused on safety protocols.",
    },

    // Sad responses
    sad: {
      calm: "I notice you're feeling down but maintaining composure. Would you like to talk about what's on your mind?",
      energetic: "You seem sad but energetic. Physical activity might help process these emotions.",
      neutral: "I'm here if you need support. Sometimes talking through feelings can help.",
      tired: "You appear both sad and tired. Rest is important for emotional recovery. Consider a short nap.",
      anxious: "I sense sadness and anxiety. Let's try a guided meditation to help you feel more centered.",
      excited: "Mixed emotions detected. It's normal to feel complex emotions during missions.",
    },

    // Stressed responses
    stressed: {
      calm: "I detect stress but you're managing it well. Take deep breaths and focus on one task at a time.",
      energetic: "High stress and energy detected. Channel this into productive action, but don't forget to breathe.",
      neutral: "Stress levels elevated. Let's implement some stress-reduction techniques right now.",
      tired: "Stress and fatigue is a concerning combination. Please prioritize rest and recovery.",
      anxious:
        "High stress and anxiety detected. This requires immediate attention. Let's start with breathing exercises.",
      excited: "Stress mixed with excitement can be overwhelming. Let's find your center.",
    },

    // Neutral responses
    neutral: {
      calm: "You're in a balanced state. This is perfect for focused work and decision-making.",
      energetic: "Neutral mood with good energy. You're ready for productive activities.",
      neutral: "Baseline emotional state detected. All systems normal.",
      tired: "You seem neutral but tired. Consider if you need rest or stimulation.",
      anxious: "Neutral mood but some anxiety present. Let's address any underlying concerns.",
      excited: "Calm demeanor with inner excitement. Good balance for mission tasks.",
    },

    // Focused responses
    focused: {
      calm: "Excellent focus and calm energy. Perfect state for complex problem-solving.",
      energetic: "High focus with good energy levels. You're in an optimal performance state.",
      neutral: "Strong focus detected. Maintain this concentration for important tasks.",
      tired: "Good focus despite fatigue. Monitor your energy levels to avoid burnout.",
      anxious: "Focused but anxious. Try to relax your shoulders and breathe deeply while working.",
      excited: "Focused excitement is great for creative problem-solving. Stay on track!",
    },

    // Tired responses
    tired: {
      calm: "Fatigue detected but you're staying calm. Consider rest or light activity to recharge.",
      energetic: "Tired but energetic - this might indicate stress. Ensure you're getting quality rest.",
      neutral: "Fatigue levels concerning. Please prioritize sleep and recovery time.",
      tired: "Significant fatigue detected. Rest is not optional - it's essential for mission safety.",
      anxious: "Tired and anxious is a difficult combination. Let's focus on relaxation and rest.",
      excited: "Tired but excited might lead to poor decisions. Please rest before continuing.",
    },
  }

  const emotionResponses = responses[facial] || responses.neutral
  const response = emotionResponses[voice] || emotionResponses.neutral

  return {
    id: Date.now().toString(),
    message: response,
    type:
      facial === "stressed" || (facial === "tired" && voice === "anxious")
        ? "alert"
        : facial === "happy" || facial === "focused"
          ? "support"
          : "suggestion",
    timestamp: new Date(),
    emotion: facial,
    voiceTone: voice,
  }
}

const getWellnessActivities = (facial: FacialEmotion): ChatMessage[] => {
  const activities = {
    happy: [
      "Consider sharing your positive energy with your crew members.",
      "This is a great time for creative problem-solving or learning new skills.",
    ],
    sad: [
      "Try journaling about your thoughts and feelings.",
      "Consider reaching out to Earth for a video call with loved ones.",
      "Gentle stretching or yoga might help improve your mood.",
    ],
    stressed: [
      "Let's do a 5-minute breathing exercise: 4 counts in, hold for 4, out for 6.",
      "Progressive muscle relaxation can help release physical tension.",
      "Consider listening to calming music or nature sounds.",
    ],
    neutral: [
      "This is a good time for routine maintenance tasks.",
      "Consider doing some light exercise to boost energy levels.",
    ],
    focused: [
      "Perfect time for detailed work or important communications.",
      "Maintain this state with proper hydration and posture.",
    ],
    tired: [
      "Schedule a rest period as soon as mission priorities allow.",
      "Try a 10-minute power nap if possible.",
      "Ensure you're staying hydrated and have eaten recently.",
    ],
  }

  return (activities[facial] || activities.neutral).map((activity, index) => ({
    id: `${Date.now()}-${index}`,
    message: activity,
    type: "suggestion" as const,
    timestamp: new Date(),
    emotion: facial,
  }))
}

export function useChatResponses() {
  const { currentEmotion, emotionHistory } = useEmotionDetection()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      message:
        "Welcome to your well-being session. I'm MAITRI, your AI companion for this mission. I'll monitor your emotional state and provide support when needed.",
      type: "info",
      timestamp: new Date(),
    },
  ])

  const [lastEmotionId, setLastEmotionId] = useState<string>("")

  useEffect(() => {
    const emotionId = `${currentEmotion.facial}-${currentEmotion.voice}-${currentEmotion.timestamp.getTime()}`

    if (emotionId !== lastEmotionId && currentEmotion.confidence > 0.7) {
      const response = getEmotionResponse(currentEmotion.facial, currentEmotion.voice)

      setMessages((prev) => [response, ...prev].slice(0, 10)) // Keep last 10 messages

      // Add wellness activities for concerning emotions
      if (["stressed", "sad", "tired"].includes(currentEmotion.facial)) {
        setTimeout(() => {
          const activities = getWellnessActivities(currentEmotion.facial)
          setMessages((prev) => [...activities, ...prev].slice(0, 10))
        }, 2000)
      }

      setLastEmotionId(emotionId)
    }
  }, [currentEmotion, lastEmotionId])

  const addCustomMessage = (message: string, type: ChatMessage["type"] = "info") => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    }
    setMessages((prev) => [newMessage, ...prev].slice(0, 10))
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "welcome",
        message: "Messages cleared. I'm still here to support you.",
        type: "info",
        timestamp: new Date(),
      },
    ])
  }

  return {
    messages,
    addCustomMessage,
    clearMessages,
  }
}
