'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User, Clock, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  options?: string[]
}

interface ChatState {
  isOpen: boolean
  messages: Message[]
  isTyping: boolean
  currentContext: string
}

const PREDEFINED_RESPONSES = {
  greeting: {
    text: "¡Hola! 👋 Soy el asistente virtual de GeekWear. ¿En qué puedo ayudarte hoy?",
    options: ["🛍️ Ver productos", "📦 Info de envíos", "🛠️ Soporte técnico", "🕒 Horarios", "🔥 Ofertas especiales"]
  },
  productos: {
    text: "¡Genial! 🎮 Tenemos una increíble colección de:\n\n• Camisetas de anime (Naruto, One Piece, Dragon Ball)\n• Ropa gaming (League of Legends, Minecraft, Fortnite)\n• Hoodies y sudaderas temáticas\n• Accesorios geek únicos\n\n¿Te interesa alguna categoría en particular?",
    options: ["👕 Camisetas anime", "🎮 Ropa gaming", "👘 Hoodies", "🔙 Volver al menú"]
  },
  envios: {
    text: "📦 Información de envíos:\n\n• Envío GRATIS en compras +$500 MXN\n• Entrega 3-5 días hábiles\n• Cobertura nacional\n• Rastreo incluido\n• Empaque discreto y seguro\n\n¿Necesitas más detalles sobre algún aspecto?",
    options: ["💰 Costos de envío", "📍 Zonas de cobertura", "📱 Rastrear pedido", "🔙 Volver al menú"]
  },
  soporte: {
    text: "🛠️ Estoy aquí para ayudarte:\n\n• Problemas con tu pedido\n• Cambios y devoluciones\n• Tallas y medidas\n• Métodos de pago\n• Cuenta de usuario\n\n¿Con qué necesitas ayuda específicamente?",
    options: ["📦 Mi pedido", "↩️ Devoluciones", "📏 Guía de tallas", "💳 Pagos", "🔙 Volver al menú"]
  },
  horarios: {
    text: "🕒 Nuestros horarios de atención:\n\n📞 Atención telefónica:\nLunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 10:00 AM - 2:00 PM\n\n💬 Chat en línea:\n24/7 con respuestas automáticas\nSoporte humano en horario laboral\n\n📧 Email: Respuesta en 24 hrs",
    options: ["📱 Contactar por WhatsApp", "📧 Enviar email", "🔙 Volver al menú"]
  },
  ofertas: {
    text: "🔥 ¡Ofertas especiales activas!\n\n• 20% OFF en segunda prenda\n• Envío GRATIS +$500\n• 3x2 en camisetas seleccionadas\n• Descuento estudiante: 15%\n• Código: GEEK2024 (10% extra)\n\n¡No te pierdas estas promociones!",
    options: ["🛍️ Ver ofertas", "🎓 Descuento estudiante", "📱 Compartir código", "🔙 Volver al menú"]
  }
}

const KEYWORD_RESPONSES = {
  'hola': 'greeting',
  'productos': 'productos',
  'camisetas': 'productos',
  'anime': 'productos',
  'gaming': 'productos',
  'envio': 'envios',
  'envios': 'envios',
  'entrega': 'envios',
  'soporte': 'soporte',
  'ayuda': 'soporte',
  'problema': 'soporte',
  'horarios': 'horarios',
  'horario': 'horarios',
  'ofertas': 'ofertas',
  'descuento': 'ofertas',
  'promocion': 'ofertas'
}

export default function Chatbox() {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    messages: [],
    isTyping: false,
    currentContext: 'main'
  })
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  const addMessage = (text: string, sender: 'user' | 'bot', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      options
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }))
  }

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setChatState(prev => ({ ...prev, isTyping: true }))
    setTimeout(() => {
      setChatState(prev => ({ ...prev, isTyping: false }))
      callback()
    }, delay)
  }

  const handleOpenChat = () => {
    setChatState(prev => ({ ...prev, isOpen: true }))
    
    if (chatState.messages.length === 0) {
      setTimeout(() => {
        addMessage(
          PREDEFINED_RESPONSES.greeting.text,
          'bot',
          PREDEFINED_RESPONSES.greeting.options
        )
      }, 500)
    }
  }

  const handleCloseChat = () => {
    setChatState(prev => ({ ...prev, isOpen: false }))
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, 'user')
    setInputValue('')

    // Buscar respuesta basada en palabras clave
    const lowerMessage = userMessage.toLowerCase()
    let responseKey = null

    for (const [keyword, response] of Object.entries(KEYWORD_RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        responseKey = response
        break
      }
    }

    simulateTyping(() => {
      if (responseKey && PREDEFINED_RESPONSES[responseKey as keyof typeof PREDEFINED_RESPONSES]) {
        const response = PREDEFINED_RESPONSES[responseKey as keyof typeof PREDEFINED_RESPONSES]
        addMessage(response.text, 'bot', response.options)
      } else {
        addMessage(
          "🤔 No estoy seguro de cómo ayudarte con eso. ¿Podrías elegir una de estas opciones?",
          'bot',
          PREDEFINED_RESPONSES.greeting.options
        )
      }
    })
  }

  const handleOptionClick = (option: string) => {
    addMessage(option, 'user')

    let responseKey = null
    const optionLower = option.toLowerCase()

    if (optionLower.includes('productos') || optionLower.includes('🛍️')) {
      responseKey = 'productos'
    } else if (optionLower.includes('envíos') || optionLower.includes('📦')) {
      responseKey = 'envios'
    } else if (optionLower.includes('soporte') || optionLower.includes('🛠️')) {
      responseKey = 'soporte'
    } else if (optionLower.includes('horarios') || optionLower.includes('🕒')) {
      responseKey = 'horarios'
    } else if (optionLower.includes('ofertas') || optionLower.includes('🔥')) {
      responseKey = 'ofertas'
    } else if (optionLower.includes('whatsapp') || optionLower.includes('📱')) {
      window.open('https://wa.me/5219983513473?text=Hola,%20necesito%20ayuda%20con%20GeekWear', '_blank')
      addMessage("Te he redirigido a WhatsApp. ¡Nuestro equipo te atenderá pronto! 📱", 'bot', ["🔙 Volver al menú"])
      return
    } else if (optionLower.includes('volver') || optionLower.includes('🔙')) {
      responseKey = 'greeting'
    }

    if (responseKey) {
      simulateTyping(() => {
        const response = PREDEFINED_RESPONSES[responseKey as keyof typeof PREDEFINED_RESPONSES]
        addMessage(response.text, 'bot', response.options)
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  if (!chatState.isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpenChat}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-[500px] shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente GeekWear</h3>
                <p className="text-xs opacity-90">En línea</p>
              </div>
            </div>
            <Button
              onClick={handleCloseChat}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
            {chatState.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-purple-500' 
                      : 'bg-green-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white border shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    {message.options && (
                      <div className="space-y-1">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs h-8 bg-white hover:bg-gray-50"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{message.timestamp.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {chatState.isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
