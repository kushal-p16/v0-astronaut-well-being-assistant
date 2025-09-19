"use client"

import { useEmotionDetection } from "@/hooks/use-emotion-detection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Play, Pause, RotateCcw, Info } from "lucide-react"
import { motion } from "framer-motion"

export function SettingsPanel() {
  const { demoMode, toggleDemoMode, analyzeEmotion, isAnalyzing } = useEmotionDetection()

  return (
    <div className="space-y-6">
      {/* Demo Mode Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Play className="w-5 h-5" />
              Demo Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Enable Demo Mode</span>
                  <Badge variant={demoMode ? "default" : "outline"} className="text-xs">
                    {demoMode ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically generates simulated emotions every 5 seconds for demonstration purposes
                </p>
              </div>
              <Switch checked={demoMode} onCheckedChange={toggleDemoMode} />
            </div>

            <Separator className="bg-primary/20" />

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Manual Controls</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={analyzeEmotion}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 bg-transparent"
                >
                  {isAnalyzing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isAnalyzing ? "Analyzing..." : "Analyze Now"}
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Session
                </Button>
              </div>
            </div>

            {demoMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary/10 p-4 rounded-lg border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h5 className="font-medium text-primary">Demo Mode Active</h5>
                    <p className="text-sm text-muted-foreground">
                      The system is now generating simulated emotions automatically. This mode is perfect for
                      presentations and testing the interface without requiring real camera/microphone input.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Emotions update every 5 seconds</li>
                      <li>• Confidence levels are randomized (60-100%)</li>
                      <li>• Chat responses are generated automatically</li>
                      <li>• Dashboard charts populate with demo data</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Auto-Analysis</span>
                <p className="text-sm text-muted-foreground">Automatically analyze emotions when camera is active</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Voice Recording</span>
                <p className="text-sm text-muted-foreground">Enable microphone for voice tone analysis</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Notifications</span>
                <p className="text-sm text-muted-foreground">Show alerts for concerning emotional states</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Data Logging</span>
                <p className="text-sm text-muted-foreground">Save emotion history for mission reports</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/10 p-4 rounded-lg border border-primary/10">
              <h5 className="font-medium mb-2">Data Privacy</h5>
              <p className="text-sm text-muted-foreground mb-3">
                All emotion detection and analysis happens locally in your browser. No personal data is transmitted to
                external servers.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Camera feed is processed locally</li>
                <li>• Audio recordings are temporary and not stored</li>
                <li>• Emotion history is kept in browser memory only</li>
                <li>• No data is shared with third parties</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                Clear All Data
              </Button>
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                Export Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">About MAITRI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                MAITRI (Mental AI Technology for Resilience and Intelligence) is an advanced AI well-being assistant
                designed specifically for astronauts and space missions.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Version:</span>
                  <span className="text-muted-foreground ml-2">1.0.0</span>
                </div>
                <div>
                  <span className="font-medium">Build:</span>
                  <span className="text-muted-foreground ml-2">2024.01</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className="ml-2 border-green-400/30 text-green-400">
                    Operational
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Mode:</span>
                  <Badge variant="outline" className="ml-2 border-primary/30 text-primary">
                    Mission Ready
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
