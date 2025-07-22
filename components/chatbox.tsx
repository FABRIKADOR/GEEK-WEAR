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
    options: ["Ver productos", "Información de envíos", "Soporte técnico", "Horarios de atención"],
  },
  productos: {
    text: "🛍️ Tenemos una increíble colección de camisetas geek:\n\n• Anime (Naruto, Dragon Ball, Attack on Titan)\n• Gaming (Zelda, Mario, Pokémon)\n• Tecnología y programación\n• Diseños exclusivos\n\n¿Te interesa alguna categoría en particular?",
    options: ["Ver camisetas anime", "Ver camisetas gaming", "Ofertas especiales", "Volver al menú"],
  },
  envios: {
    text: "📦 Información de envíos:\n\n• Envío gratis en compras +$500\n• Entrega 3-5 días hábiles\n• Cobertura nacional\n• Rastreo incluido\n• Empaque discreto\n\n¿Necesitas más detalles?",
    options: ["Costos de envío", "Tiempos de entrega", "Rastreo de pedido", "Volver al menú"],
  },
  soporte: {
    text: "🛠️ Soporte técnico disponible:\n\n• Chat en vivo: Lun-Vie 9AM-6PM\n• Email: soporte@geekwear.com\n• WhatsApp: +52 998 351-3473\n• Respuesta promedio: 2 horas\n\n¿Prefieres contactar por WhatsApp?",
    options: ["Abrir WhatsApp", "Enviar email", "Horarios detallados", "Volver al menú"],
  },
  horarios: {
    text: "🕒 Horarios de atención:\n\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 10:00 AM - 4:00 PM\n• Domingos: Cerrado\n• Zona horaria: México (GMT-6)\n\nFuera de horario, puedes escribirnos y te responderemos pronto.",
    options: ["Contactar ahora", "Dejar mensaje", "Ver ubicación", "Volver al menú"],
  },
  anime: {
    text: "🎌 Camisetas de Anime más populares:\n\n• Naruto y Boruto\n• Dragon Ball Super\n• Attack on Titan\n• One Piece\n• Demon Slayer\n• My Hero Academia\n\n¡Diseños oficiales y exclusivos!",
    options: ["Ver catálogo anime", "Ofertas anime", "Próximos lanzamientos", "Volver al menú"],
  },
  gaming: {
    text: "🎮 Camisetas Gaming destacadas:\n\n• The Legend of Zelda\n• Super Mario Bros\n• Pokémon\n• Minecraft\n• Among Us\n• Retro Gaming\n\n¡Para verdaderos gamers!",
    options: ["Ver catálogo gaming", "Ofertas gaming", "Ediciones limitadas", "Volver al menú"],
  },
  ofertas: {
    text: "🔥 Ofertas especiales activas:\n\n• 2x1 en camisetas seleccionadas\n• 20% OFF en tu primera compra\n• Envío gratis en compras +$500\n• Descuento por volumen\n\n¡Aprovecha antes de que terminen!",
    options: ["Ver ofertas", "Código de descuento", "Términos y condiciones", "Volver al menú"],
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
      } else if (userMessage.includes("horario") || userMessage.includes("hora") || userMessage.includes("cuando")) {
        addBotMessage(PREDEFINED_RESPONSES.horarios.text, PREDEFINED_RESPONSES.horarios.options)
      } else if (userMessage.includes("anime")) {
        addBotMessage(PREDEFINED_RESPONSES.anime.text, PREDEFINED_RESPONSES.anime.options)
      } else if (userMessage.includes("gaming") || userMessage.includes("juego")) {
        addBotMessage(PREDEFINED_RESPONSES.gaming.text, PREDEFINED_RESPONSES.gaming.options)
      } else if (userMessage.includes("oferta") || userMessage.includes("descuento")) {
        addBotMessage(PREDEFINED_RESPONSES.ofertas.text, PREDEFINED_RESPONSES.ofertas.options)
      } else {
        addBotMessage("🤔 No estoy seguro de cómo ayudarte con eso. ¿Podrías elegir una de estas opciones?", [
          "Ver productos",
          "Información de envíos",
          "Soporte técnico",
          "Horarios de atención",
        ])
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
        case "horarios de atención":
          addBotMessage(PREDEFINED_RESPONSES.horarios.text, PREDEFINED_RESPONSES.horarios.options)
          break
        case "ver camisetas anime":
          addBotMessage(PREDEFINED_RESPONSES.anime.text, PREDEFINED_RESPONSES.anime.options)
          break
        case "ver camisetas gaming":
          addBotMessage(PREDEFINED_RESPONSES.gaming.text, PREDEFINED_RESPONSES.gaming.options)
          break
        case "ofertas especiales":
          addBotMessage(PREDEFINED_RESPONSES.ofertas.text, PREDEFINED_RESPONSES.ofertas.options)
          break
        case "abrir whatsapp":
          addBotMessage("📱 Te redirijo a WhatsApp para atención personalizada...")
          setTimeout(() => {
            window.open("https://wa.me/5299835134733?text=Hola,%20necesito%20ayuda%20con%20GeekWear", "_blank")
          }, 1000)
          break
        case "volver al menú":
          addBotMessage(PREDEFINED_RESPONSES.greeting.text, PREDEFINED_RESPONSES.greeting.options)
          break
        default:
          addBotMessage("Entiendo tu interés. ¿Te gustaría que te conecte con un agente humano para más detalles?", [
            "Contactar agente",
            "Abrir WhatsApp",
            "Volver al menú",
          ])
      }
    }, 800)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
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

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96">
          <Card className="h-[500px] flex flex-col shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <CardHeader className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
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

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex-shrink-0">
                      {message.sender === "bot" ? (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                      {message.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptionClick(option)}
                              className="text-xs h-7 px-2 hover:bg-purple-50 hover:border-purple-300"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t bg-white flex-shrink-0">
              <div className="flex gap-2">
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
