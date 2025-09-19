"use client"

import { useMediaAccess } from "@/hooks/use-media-access"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Loader2 } from "lucide-react"

export function WebcamFeed() {
  const { hasCamera, cameraStream, isLoading, error, videoRef, requestCameraAccess, stopStreams } = useMediaAccess()

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20 animate-pulse-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-center text-primary">Visual Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden border border-primary/30">
          {hasCamera && cameraStream ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera feed will appear here</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {!hasCamera ? (
            <Button
              onClick={requestCameraAccess}
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
              Enable Camera
            </Button>
          ) : (
            <Button
              onClick={stopStreams}
              variant="outline"
              className="flex-1 border-primary/30 hover:bg-primary/10 bg-transparent"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
