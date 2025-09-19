"use client"

import { useEmotionDetection, type FacialEmotion } from "@/hooks/use-emotion-detection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Zap, Moon, Smile, Frown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AvatarFaceProps {
  emotion: FacialEmotion
  isAnalyzing: boolean
}

const getAvatarExpression = (emotion: FacialEmotion) => {
  const expressions = {
    happy: {
      eyes: "😊",
      mouth: "😊",
      color: "text-green-400",
      bgColor: "from-green-400/20 to-green-600/20",
      icon: Smile,
      description: "Feeling positive and energetic",
    },
    sad: {
      eyes: "😢",
      mouth: "😢",
      color: "text-blue-400",
      bgColor: "from-blue-400/20 to-blue-600/20",
      icon: Frown,
      description: "Experiencing low mood",
    },
    stressed: {
      eyes: "😰",
      mouth: "😰",
      color: "text-red-400",
      bgColor: "from-red-400/20 to-red-600/20",
      icon: Zap,
      description: "Elevated stress levels detected",
    },
    neutral: {
      eyes: "😐",
      mouth: "😐",
      color: "text-gray-400",
      bgColor: "from-gray-400/20 to-gray-600/20",
      icon: Brain,
      description: "Baseline emotional state",
    },
    focused: {
      eyes: "🧐",
      mouth: "🧐",
      color: "text-purple-400",
      bgColor: "from-purple-400/20 to-purple-600/20",
      icon: Brain,
      description: "High concentration detected",
    },
    tired: {
      eyes: "😴",
      mouth: "😴",
      color: "text-orange-400",
      bgColor: "from-orange-400/20 to-orange-600/20",
      icon: Moon,
      description: "Fatigue indicators present",
    },
  }

  return expressions[emotion] || expressions.neutral
}

function AvatarFace({ emotion, isAnalyzing }: AvatarFaceProps) {
  const expression = getAvatarExpression(emotion)
  const IconComponent = expression.icon

  return (
    <motion.div
      key={emotion}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {/* Outer glow ring */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${expression.bgColor} blur-xl`}
        animate={{
          scale: isAnalyzing ? [1, 1.1, 1] : 1,
          opacity: isAnalyzing ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: isAnalyzing ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      />

      {/* Main avatar circle */}
      <motion.div
        className={`relative w-32 h-32 bg-gradient-to-br ${expression.bgColor} rounded-full flex items-center justify-center border-2 border-primary/30 backdrop-blur-sm`}
        animate={{
          y: isAnalyzing ? [0, -5, 0] : [0, -3, 0],
          rotate: isAnalyzing ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          duration: isAnalyzing ? 1.5 : 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Avatar face/icon */}
        <motion.div
          className="flex flex-col items-center space-y-1"
          animate={{
            scale: isAnalyzing ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isAnalyzing ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          <IconComponent className={`w-8 h-8 ${expression.color}`} />
          <div className={`text-2xl ${expression.color}`}>{expression.eyes}</div>
        </motion.div>

        {/* Pulse effect when analyzing */}
        {isAnalyzing && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export function InteractiveAvatar() {
  const { currentEmotion, isAnalyzing, demoMode } = useEmotionDetection()
  const expression = getAvatarExpression(currentEmotion.facial)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 h-full">
      <CardHeader>
        <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" />
          MAITRI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Avatar Display */}
        <div className="flex flex-col items-center space-y-4">
          <AnimatePresence mode="wait">
            <AvatarFace emotion={currentEmotion.facial} isAnalyzing={isAnalyzing} />
          </AnimatePresence>

          {/* Status Badge */}
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Badge variant="secondary" className={`${expression.color} bg-primary/10 border-current/30 px-3 py-1`}>
              {isAnalyzing
                ? "Analyzing..."
                : currentEmotion.facial.charAt(0).toUpperCase() + currentEmotion.facial.slice(1)}
            </Badge>
          </motion.div>
        </div>

        {/* Emotion Description */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground max-w-xs">{expression.description}</p>

          {/* Confidence indicator */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.round(currentEmotion.confidence * 5) ? "bg-primary" : "bg-muted/30"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          className="w-full space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* System Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">System Status:</span>
            <Badge variant="outline" className="border-green-400/30 text-green-400">
              Online
            </Badge>
          </div>

          {/* Demo Mode Indicator */}
          {demoMode && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                Demo Active
              </Badge>
            </div>
          )}

          {/* Last Update */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Last Update:</span>
            <span className="text-primary">{currentEmotion.timestamp.toLocaleTimeString()}</span>
          </div>
        </motion.div>

        {/* Breathing Animation Indicator */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
            animate={{
              scaleX: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}
