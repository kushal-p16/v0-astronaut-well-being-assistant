"use client"

import { useState, useEffect, useRef } from "react"

export interface MediaAccessState {
  hasCamera: boolean
  hasMicrophone: boolean
  cameraStream: MediaStream | null
  microphoneStream: MediaStream | null
  isLoading: boolean
  error: string | null
}

export function useMediaAccess() {
  const [state, setState] = useState<MediaAccessState>({
    hasCamera: false,
    hasMicrophone: false,
    cameraStream: null,
    microphoneStream: null,
    isLoading: false,
    error: null,
  })

  const videoRef = useRef<HTMLVideoElement>(null)

  const requestCameraAccess = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      setState((prev) => ({
        ...prev,
        hasCamera: true,
        cameraStream: stream,
        isLoading: false,
      }))

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Camera access denied: ${error instanceof Error ? error.message : "Unknown error"}`,
        isLoading: false,
      }))
    }
  }

  const requestMicrophoneAccess = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })

      setState((prev) => ({
        ...prev,
        hasMicrophone: true,
        microphoneStream: stream,
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Microphone access denied: ${error instanceof Error ? error.message : "Unknown error"}`,
        isLoading: false,
      }))
    }
  }

  const stopStreams = () => {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((track) => track.stop())
    }
    if (state.microphoneStream) {
      state.microphoneStream.getTracks().forEach((track) => track.stop())
    }

    setState((prev) => ({
      ...prev,
      hasCamera: false,
      hasMicrophone: false,
      cameraStream: null,
      microphoneStream: null,
    }))
  }

  useEffect(() => {
    return () => {
      stopStreams()
    }
  }, [])

  return {
    ...state,
    videoRef,
    requestCameraAccess,
    requestMicrophoneAccess,
    stopStreams,
  }
}
