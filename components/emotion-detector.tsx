"use client"

import { useEmotionDetection, type FacialEmotion, type VoiceTone } from "@/hooks/use-emotion-detection"
import { useAudioRecording } from "@/hooks/use-audio-recording"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Brain, Loader2 } from "lucide-react"

const getEmotionColor = (emotion: FacialEmotion | VoiceTone): string => {
  const colorMap = {
    happy: "text-green-400",
    sad: "text-blue-400",
    stressed: "text-red-400",
    neutral: "text-gray-400",
    focused: "text-purple-400",
    tired: "text-orange-400",
    calm: "text-green-400",
    energetic: "text-yellow-400",
    anxious: "text-red-400",
    excited: "text-pink-400",
  }
  return colorMap[emotion] || "text-gray-400"
}

const getEmotionEmoji = (emotion: FacialEmotion | VoiceTone): string => {
  const emojiMap = {
    happy: "😊",
    sad: "😢",
    stressed: "😰",
    neutral: "😐",
    focused: "🧐",
    tired: "😴",
    calm: "😌",
    energetic: "⚡",
    anxious: "😟",
    excited: "🤩",
  }
  return emojiMap[emotion] || "😐"
}

export function EmotionDetector() {
  const { currentEmotion, isAnalyzing, demoMode, analyzeEmotion, toggleDemoMode } = useEmotionDetection()

  const { isRecording, duration, error, startRecording, stopRecording } = useAudioRecording()

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Emotion Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Emotion Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Facial Expression</p>
            <div className="text-2xl">{getEmotionEmoji(currentEmotion.facial)}</div>
            <Badge variant="outline" className={`${getEmotionColor(currentEmotion.facial)} border-current`}>
              {currentEmotion.facial}
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Voice Tone</p>
            <div className="text-2xl">{getEmotionEmoji(currentEmotion.voice)}</div>
            <Badge variant="outline" className={`${getEmotionColor(currentEmotion.voice)} border-current`}>
              {currentEmotion.voice}
            </Badge>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="text-primary">{Math.round(currentEmotion.confidence * 100)}%</span>
          </div>
          <Progress value={currentEmotion.confidence * 100} className="h-2 bg-muted/20" />
        </div>

        {/* Audio Recording */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Voice Analysis</span>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                Recording {duration}s
              </Badge>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            {!isRecording ? (
              <Button onClick={startRecording} size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                <Mic className="w-4 h-4 mr-2" />
                Record Voice (10s)
              </Button>
            ) : (
              <Button onClick={stopRecording} size="sm" variant="destructive" className="flex-1">
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        {/* Analysis Controls */}
        <div className="space-y-3 pt-3 border-t border-primary/20">
          <div className="flex gap-2">
            <Button onClick={analyzeEmotion} disabled={isAnalyzing} size="sm" className="flex-1">
              {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
              Analyze Now
            </Button>
            <Button onClick={toggleDemoMode} variant={demoMode ? "default" : "outline"} size="sm" className="flex-1">
              Demo Mode {demoMode ? "ON" : "OFF"}
            </Button>
          </div>

          {demoMode && (
            <div className="text-xs text-center text-muted-foreground bg-primary/10 p-2 rounded border border-primary/20">
              Demo mode active - emotions update every 5 seconds
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-xs text-center text-muted-foreground">
          Last updated: {currentEmotion.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
