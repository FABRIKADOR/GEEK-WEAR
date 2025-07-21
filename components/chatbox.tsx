"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, User, Bot, Clock, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  options?: string[]
}

interface ChatResponse {
  text: string
  options?: string[]
  delay?: number
}

const chatResponses: Record<string, ChatResponse> = {
  greeting: {
    text: "¡Hola! 👋 Soy el asistente virtual de GeekWear. ¿En qué puedo ayudarte hoy?",
    options: ["Ver productos", "Información de envíos", "Soporte técnico", "Horarios de atención"],
    delay: 1000,
  },
  "ver productos": {
    text: "¡Genial! 🎮 Tenemos una increíble colección de camisetas:\n\n• Anime (Naruto, Dragon Ball, Attack on Titan)\n• Gaming (Zelda, Mario, Pokémon)\n• Cultura Geek (Star Wars, Marvel, DC)\n\n¿Te interesa alguna categoría en particular?",
    options: ["Camisetas Anime", "Camisetas Gaming", "Ver todas", "Volver al menú"],
    delay: 1500,
  },
  "información de envíos": {
    text: "📦 Información de envíos:\n\n• Envío GRATIS en compras +$500\n• Entrega 3-5 días hábiles\n• Cobertura nacional (México)\n• Rastreo incluido\n• Empaque discreto\n\n¿Necesitas más detalles?",
    options: ["Costos de envío", "Tiempos de entrega", "Rastreo de pedido", "Volver al menú"],
    delay: 1200,
  },
  "soporte técnico": {
    text: "🛠️ Estoy aquí para ayudarte:\n\n• Problemas con tu pedido\n• Cambios y devoluciones\n• Tallas y medidas\n• Problemas técnicos\n\n¿Cuál es tu consulta?",
    options: ["Mi pedido", "Cambios/Devoluciones", "Guía de tallas", "Volver al menú"],
    delay: 1000,
  },
  "horarios de atención": {
    text: "🕒 Nuestros horarios:\n\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 10:00 AM - 4:00 PM\n• Domingos: Cerrado\n\n📱 WhatsApp: +52 (998) 351-3473\n📧 Email: contact@geekwear.com",
    options: ["Contactar por WhatsApp", "Enviar email", "Volver al menú"],
    delay: 1300,
  },
  "camisetas anime": {
    text: "🍜 ¡Las mejores camisetas de anime!\n\n• Naruto & Boruto\n• Dragon Ball Z/Super\n• Attack on Titan\n• One Piece\n• Demon Slayer\n• My Hero Academia\n\n¡Todas con diseños exclusivos!",
    options: ["Ver Naruto", "Ver Dragon Ball", "Ver todas las anime", "Volver al menú"],
    delay: 1400,
  },
  "camisetas gaming": {
    text: "🎮 ¡Gaming collection épica!\n\n• The Legend of Zelda\n• Super Mario Bros\n• Pokémon\n• Minecraft\n• Among Us\n• Retro Gaming\n\n¡Diseños únicos para gamers!",
    options: ["Ver Zelda", "Ver Pokémon", "Ver todas las gaming", "Volver al menú"],
    delay: 1400,
  },
  "mi pedido": {
    text: "📋 Para ayudarte con tu pedido necesito:\n\n• Número de orden\n• Email de compra\n• Problema específico\n\n¿Prefieres que te contactemos directamente?",
    options: ["Contactar por WhatsApp", "Enviar email", "Volver al menú"],
    delay: 1100,
  },
  "contactar por whatsapp": {
    text: "📱 ¡Perfecto! Te redirigiremos a WhatsApp donde nuestro equipo te atenderá personalmente.\n\n+52 (998) 351-3473\n\n¿Listo para continuar?",
    options: ["Abrir WhatsApp", "Volver al menú"],
    delay: 1000,
  },
  default: {
    text: "🤔 No estoy seguro de cómo ayudarte con eso, pero nuestro equipo humano sí puede. ¿Te gustaría contactarlos?",
    options: ["Contactar por WhatsApp", "Ver opciones principales", "Volver al menú"],
    delay: 800,
  },
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensaje de bienvenida automático
      setTimeout(() => {
        addBotMessage("greeting")
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (responseKey: string) => {
    setIsTyping(true)
    const response = chatResponses[responseKey] || chatResponses.default

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        options: response.options,
      }
      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, response.delay || 1000)
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    const userInput = inputValue.toLowerCase()
    setInputValue("")

    // Buscar respuesta apropiada
    let responseKey = "default"
    for (const key in chatResponses) {
      if (userInput.includes(key.toLowerCase()) || key.toLowerCase().includes(userInput)) {
        responseKey = key
        break
      }
    }

    setTimeout(() => {
      addBotMessage(responseKey)
    }, 500)
  }

  const handleOptionClick = (option: string) => {
    addUserMessage(option)

    setTimeout(() => {
      const optionKey = option.toLowerCase()
      let responseKey = "default"

      // Mapear opciones a respuestas
      if (optionKey.includes("producto") || optionKey.includes("ver todas")) {
        responseKey = "ver productos"
      } else if (optionKey.includes("envío") || optionKey.includes("envío")) {
        responseKey = "información de envíos"
      } else if (optionKey.includes("soporte") || optionKey.includes("técnico")) {
        responseKey = "soporte técnico"
      } else if (optionKey.includes("horario") || optionKey.includes("atención")) {
        responseKey = "horarios de atención"
      } else if (optionKey.includes("anime")) {
        responseKey = "camisetas anime"
      } else if (optionKey.includes("gaming")) {
        responseKey = "camisetas gaming"
      } else if (optionKey.includes("pedido")) {
        responseKey = "mi pedido"
      } else if (optionKey.includes("whatsapp")) {
        responseKey = "contactar por whatsapp"
      } else if (optionKey.includes("volver") || optionKey.includes("menú") || optionKey.includes("principales")) {
        responseKey = "greeting"
      } else if (optionKey.includes("abrir whatsapp")) {
        // Abrir WhatsApp real
        window.open("https://wa.me/5299835134730?text=Hola,%20vengo%20del%20chatbot%20de%20GeekWear", "_blank")
        return
      }

      addBotMessage(responseKey)
    }, 500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96">
          <Card className="h-[500px] flex flex-col shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Asistente GeekWear</h3>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-400"}`} />
                      <span>{isOnline ? "En línea" : "Desconectado"}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? "" : "flex-row-reverse space-x-reverse"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isBot ? "bg-purple-100" : "bg-blue-100"
                      }`}
                    >
                      {message.isBot ? (
                        <Bot className="h-4 w-4 text-purple-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-lg ${
                          message.isBot ? "bg-white border shadow-sm" : "bg-blue-500 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>

                      {/* Opciones rápidas */}
                      {message.options && (
                        <div className="space-y-1">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptionClick(option)}
                              className="w-full justify-start text-left h-auto py-2 px-3 text-xs hover:bg-purple-50 hover:border-purple-200"
                            >
                              {option.includes("Volver") && <ArrowLeft className="h-3 w-3 mr-1" />}
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 bg-white border-t">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
