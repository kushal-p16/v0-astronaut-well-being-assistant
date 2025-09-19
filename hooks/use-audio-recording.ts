"use client"

import { useState, useRef, useCallback } from "react"

export interface AudioRecordingState {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  error: string | null
}

export function useAudioRecording() {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    error: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        setState((prev) => ({
          ...prev,
          audioBlob,
          isRecording: false,
          duration: 0,
        }))
      }

      mediaRecorder.start()
      setState((prev) => ({ ...prev, isRecording: true, error: null, duration: 0 }))

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording()
        }
      }, 10000)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Recording failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        isRecording: false,
      }))
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  return {
    ...state,
    startRecording,
    stopRecording,
  }
}
