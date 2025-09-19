"use client"

import { useChatResponses, type ChatMessage } from "@/hooks/use-chat-responses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, AlertTriangle, Lightbulb, Info, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const getMessageIcon = (type: ChatMessage["type"]) => {
  const icons = {
    support: MessageCircle,
    suggestion: Lightbulb,
    alert: AlertTriangle,
    info: Info,
  }
  return icons[type] || Info
}

const getMessageStyle = (type: ChatMessage["type"]) => {
  const styles = {
    support: "bg-green-500/10 border-green-500/20 text-green-400",
    suggestion: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    alert: "bg-red-500/10 border-red-500/20 text-red-400",
    info: "bg-primary/10 border-primary/20 text-primary",
  }
  return styles[type] || styles.info
}

function ChatMessageItem({ message, index }: { message: ChatMessage; index: number }) {
  const IconComponent = getMessageIcon(message.type)
  const messageStyle = getMessageStyle(message.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={`p-3 rounded-lg border ${messageStyle} backdrop-blur-sm`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{message.message}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {message.emotion && (
                <Badge variant="outline" className="text-xs border-current/30">
                  {message.emotion}
                </Badge>
              )}
              {message.voiceTone && (
                <Badge variant="outline" className="text-xs border-current/30">
                  {message.voiceTone}
                </Badge>
              )}
            </div>
            <span className="text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ChatResponseSystem() {
  const { messages, clearMessages } = useChatResponses()

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Support Messages
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {messages.length} messages
            </Badge>
            <Button
              onClick={clearMessages}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-4">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <ChatMessageItem key={message.id} message={message} index={index} />
              ))}
            </AnimatePresence>

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Start emotion detection to receive support.</p>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t border-primary/20">
          <div className="grid grid-cols-4 gap-2 text-center">
            {(["support", "suggestion", "alert", "info"] as const).map((type) => {
              const count = messages.filter((m) => m.type === type).length
              const IconComponent = getMessageIcon(type)
              return (
                <div key={type} className="space-y-1">
                  <IconComponent className="w-4 h-4 mx-auto text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
