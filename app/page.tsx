"use client"

import { WebcamFeed } from "@/components/webcam-feed"
import { EmotionDetector } from "@/components/emotion-detector"
import { InteractiveAvatar } from "@/components/interactive-avatar"
import { ChatResponseSystem } from "@/components/chat-response-system"
import { WellBeingDashboard } from "@/components/well-being-dashboard"
import { SettingsPanel } from "@/components/settings-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Rocket, Heart, Brain, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg animate-float">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">MAITRI</h1>
                <p className="text-sm text-muted-foreground">AI Well-Being Assistant for Astronauts</p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Mission Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 border border-primary/20">
            <TabsTrigger
              value="monitor"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="w-4 h-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Webcam Feed */}
              <div className="xl:col-span-1">
                <WebcamFeed />
              </div>

              {/* Emotion Detection */}
              <div className="xl:col-span-1">
                <EmotionDetector />
              </div>

              {/* Interactive Avatar */}
              <div className="xl:col-span-1">
                <InteractiveAvatar />
              </div>
            </div>

            {/* Chat Response Section */}
            <div className="grid grid-cols-1 gap-6">
              <ChatResponseSystem />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <WellBeingDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
