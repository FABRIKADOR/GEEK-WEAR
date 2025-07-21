"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Clock } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  options?: string[]
}

const PREDEFINED_RESPONSES = {
  greeting: {
    text: "¡Hola! 👋 Soy el asistente virtual de GeekWear. ¿En qué puedo ayudarte hoy?",
    options: ["Ver productos", "Información de envíos", "Soporte técnico", "Horarios", "Ofertas especiales"],
  },
  productos: {
    text: "🛍️ Tenemos una increíble colección de productos geek:\n\n• Camisetas de anime (Naruto, Dragon Ball, One Piece)\n• Camisetas gaming (League of Legends, Minecraft, Fortnite)\n• Accesorios y gadgets tecnológicos\n• Productos personalizados\n\n¿Te interesa alguna categoría en particular?",
    options: ["Camisetas anime", "Camisetas gaming", "Accesorios", "Volver al menú"],
  },
  envios: {
    text: "📦 Información de envíos:\n\n• Envío GRATIS en pedidos mayores a $500 MXN\n• Entrega en 2-5 días hábiles en Quintana Roo\n• Envíos a toda la República Mexicana\n• Costo de envío desde $80 MXN\n• Rastreo incluido en todos los envíos\n\n¿Necesitas más detalles sobre algún aspecto?",
    options: ["Costos de envío", "Tiempos de entrega", "Rastreo", "Volver al menú"],
  },
  soporte: {
    text: "🛠️ Soporte técnico disponible:\n\n• Chat en vivo: Lun-Vie 9:00 AM - 6:00 PM\n• WhatsApp: +52 (998) 351-3473\n• Email: contact@geekwear.com\n• Respuesta promedio: 2 horas\n\n¿Prefieres contactarnos por WhatsApp ahora?",
    options: ["Ir a WhatsApp", "Enviar email", "Volver al menú"],
  },
  horarios: {
    text: "🕒 Nuestros horarios de atención:\n\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 10:00 AM - 4:00 PM\n• Domingos: Cerrado\n• Zona horaria: GMT-5 (México)\n\nPuedes visitarnos en UPQROO o contactarnos por WhatsApp.",
    options: ["Ubicación", "WhatsApp", "Volver al menú"],
  },
  ofertas: {
    text: "🔥 ¡Ofertas especiales disponibles!\n\n• 15% OFF en tu primera compra\n• 2x1 en camisetas seleccionadas\n• Envío gratis en compras +$500\n• Descuentos por volumen para revendedores\n\n¿Te interesa alguna oferta en particular?",
    options: ["Primera compra", "Ofertas 2x1", "Para revendedores", "Volver al menú"],
  },
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        addBotMessage(PREDEFINED_RESPONSES.greeting.text, PREDEFINED_RESPONSES.greeting.options)
      }, 500)
    }
  }, [isOpen])

  const addMessage = (text: string, sender: "user" | "bot", options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      options,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true)
    setTimeout(
      () => {
        setIsTyping(false)
        addMessage(text, "bot", options)
      },
      1000 + Math.random() * 1000,
    ) // Simular tiempo de escritura variable
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, "user")
    const userMessage = inputValue.toLowerCase()
    setInputValue("")

    // Procesar respuesta basada en palabras clave
    setTimeout(() => {
      if (userMessage.includes("producto") || userMessage.includes("camiseta") || userMessage.includes("comprar")) {
        addBotMessage(PREDEFINED_RESPONSES.productos.text, PREDEFINED_RESPONSES.productos.options)
      } else if (userMessage.includes("envio") || userMessage.includes("entrega") || userMessage.includes("shipping")) {
        addBotMessage(PREDEFINED_RESPONSES.envios.text, PREDEFINED_RESPONSES.envios.options)
      } else if (userMessage.includes("soporte") || userMessage.includes("ayuda") || userMessage.includes("problema")) {
        addBotMessage(PREDEFINED_RESPONSES.soporte.text, PREDEFINED_RESPONSES.soporte.options)
      } else if (userMessage.includes("horario") || userMessage.includes("hora") || userMessage.includes("abierto")) {
        addBotMessage(PREDEFINED_RESPONSES.horarios.text, PREDEFINED_RESPONSES.horarios.options)
      } else if (
        userMessage.includes("oferta") ||
        userMessage.includes("descuento") ||
        userMessage.includes("promocion")
      ) {
        addBotMessage(PREDEFINED_RESPONSES.ofertas.text, PREDEFINED_RESPONSES.ofertas.options)
      } else {
        addBotMessage(
          "🤔 No estoy seguro de cómo ayudarte con eso. ¿Podrías elegir una de estas opciones?",
          PREDEFINED_RESPONSES.greeting.options,
        )
      }
    }, 500)
  }

  const handleOptionClick = (option: string) => {
    addMessage(option, "user")

    setTimeout(() => {
      switch (option.toLowerCase()) {
        case "ver productos":
          addBotMessage(PREDEFINED_RESPONSES.productos.text, PREDEFINED_RESPONSES.productos.options)
          break
        case "información de envíos":
          addBotMessage(PREDEFINED_RESPONSES.envios.text, PREDEFINED_RESPONSES.envios.options)
          break
        case "soporte técnico":
          addBotMessage(PREDEFINED_RESPONSES.soporte.text, PREDEFINED_RESPONSES.soporte.options)
          break
        case "horarios":
          addBotMessage(PREDEFINED_RESPONSES.horarios.text, PREDEFINED_RESPONSES.horarios.options)
          break
        case "ofertas especiales":
          addBotMessage(PREDEFINED_RESPONSES.ofertas.text, PREDEFINED_RESPONSES.ofertas.options)
          break
        case "ir a whatsapp":
          window.open("https://wa.me/5219983513473?text=Hola,%20necesito%20soporte%20técnico", "_blank")
          addBotMessage(
            "Te he redirigido a WhatsApp. ¿Hay algo más en lo que pueda ayudarte?",
            PREDEFINED_RESPONSES.greeting.options,
          )
          break
        case "volver al menú":
          addBotMessage("¿En qué más puedo ayudarte?", PREDEFINED_RESPONSES.greeting.options)
          break
        default:
          addBotMessage(
            "Gracias por tu interés. Para más detalles específicos, te recomiendo contactarnos por WhatsApp.",
            ["Ir a WhatsApp", "Volver al menú"],
          )
      }
    }, 800)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
        </Button>
      </div>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96">
          <Card className="h-[500px] flex flex-col shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <CardHeader className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">GeekWear Assistant</h3>
                    <p className="text-sm opacity-90 flex items-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                      En línea
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Área de mensajes */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <div
                        className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          message.sender === "user" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
                        }`}
                      >
                        {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user" ? "bg-purple-600 text-white" : "bg-white border shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <div
                          className={`flex items-center mt-1 text-xs ${
                            message.sender === "user" ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opciones rápidas */}
                  {message.options && (
                    <div className="flex flex-wrap gap-2 ml-10">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptionClick(option)}
                          className="text-xs hover:bg-purple-50 hover:border-purple-300"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input de mensaje */}
            <div className="flex-shrink-0 p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-purple-600 hover:bg-purple-700">
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
