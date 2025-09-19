"use client"

import { useEmotionDetection } from "@/hooks/use-emotion-detection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Clock, Activity, Brain, Heart } from "lucide-react"
import { motion } from "framer-motion"

const EMOTION_COLORS = {
  happy: "#22c55e",
  sad: "#3b82f6",
  stressed: "#ef4444",
  neutral: "#6b7280",
  focused: "#8b5cf6",
  tired: "#f97316",
}

const VOICE_COLORS = {
  calm: "#22c55e",
  energetic: "#eab308",
  tired: "#f97316",
  anxious: "#ef4444",
  excited: "#ec4899",
  neutral: "#6b7280",
}

export function WellBeingDashboard() {
  const { emotionHistory, currentEmotion } = useEmotionDetection()

  // Process emotion history for charts
  const emotionCounts = emotionHistory.reduce(
    (acc, emotion) => {
      acc[emotion.facial] = (acc[emotion.facial] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const voiceCounts = emotionHistory.reduce(
    (acc, emotion) => {
      acc[emotion.voice] = (acc[emotion.voice] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion,
    value: count,
    color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || "#6b7280",
  }))

  const voicePieData = Object.entries(voiceCounts).map(([voice, count]) => ({
    name: voice,
    value: count,
    color: VOICE_COLORS[voice as keyof typeof VOICE_COLORS] || "#6b7280",
  }))

  // Timeline data for line chart
  const timelineData = emotionHistory
    .slice(0, 10)
    .reverse()
    .map((emotion, index) => ({
      time: emotion.timestamp.toLocaleTimeString(),
      confidence: Math.round(emotion.confidence * 100),
      emotion: emotion.facial,
      voice: emotion.voice,
    }))

  // Calculate wellness score
  const calculateWellnessScore = () => {
    if (emotionHistory.length === 0) return 75

    const recentEmotions = emotionHistory.slice(0, 5)
    const positiveEmotions = recentEmotions.filter(
      (e) => ["happy", "focused", "neutral"].includes(e.facial) && ["calm", "energetic", "neutral"].includes(e.voice),
    ).length

    const avgConfidence = recentEmotions.reduce((sum, e) => sum + e.confidence, 0) / recentEmotions.length

    return Math.round((positiveEmotions / recentEmotions.length) * 70 + avgConfidence * 30)
  }

  const wellnessScore = calculateWellnessScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Attention"
  }

  return (
    <div className="space-y-6">
      {/* Wellness Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wellness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-3xl font-bold ${getScoreColor(wellnessScore)}`}>{wellnessScore}</span>
                  <Badge variant="outline" className={`${getScoreColor(wellnessScore)} border-current`}>
                    {getScoreStatus(wellnessScore)}
                  </Badge>
                </div>
                <Progress value={wellnessScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on recent emotional patterns and confidence levels
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Current State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Facial:</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {currentEmotion.facial}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice:</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {currentEmotion.voice}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confidence:</span>
                  <span className="text-primary font-medium">{Math.round(currentEmotion.confidence * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Readings:</span>
                  <span className="text-primary font-medium">{emotionHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session Time:</span>
                  <span className="text-primary font-medium">
                    {emotionHistory.length > 0
                      ? Math.round(
                          (Date.now() - emotionHistory[emotionHistory.length - 1].timestamp.getTime()) / 60000,
                        ) + "m"
                      : "0m"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Update:</span>
                  <span className="text-primary font-medium">{currentEmotion.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Facial Emotion Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No emotion data yet</p>
                    <p className="text-sm">Start detection to see patterns</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Tone Distribution */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Voice Tone Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {voicePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={voicePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {voicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No voice data yet</p>
                    <p className="text-sm">Record audio to see patterns</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timeline and History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confidence Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Confidence Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                    <XAxis dataKey="time" stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                    <YAxis stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No timeline data yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {emotionHistory.slice(0, 8).map((emotion, index) => (
                    <motion.div
                      key={emotion.timestamp.getTime()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-primary/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              color: EMOTION_COLORS[emotion.facial as keyof typeof EMOTION_COLORS],
                              borderColor: EMOTION_COLORS[emotion.facial as keyof typeof EMOTION_COLORS] + "50",
                            }}
                          >
                            {emotion.facial}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              color: VOICE_COLORS[emotion.voice as keyof typeof VOICE_COLORS],
                              borderColor: VOICE_COLORS[emotion.voice as keyof typeof VOICE_COLORS] + "50",
                            }}
                          >
                            {emotion.voice}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{emotion.timestamp.toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-primary font-medium">{Math.round(emotion.confidence * 100)}%</p>
                      </div>
                    </motion.div>
                  ))}

                  {emotionHistory.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No history yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
