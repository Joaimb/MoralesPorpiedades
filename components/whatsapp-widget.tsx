"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Phone, User, DollarSign, Home, Calendar, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface WhatsAppWidgetProps {
  phoneNumber?: string
  companyName?: string
  properties?: any[]
}

export default function WhatsAppWidget({
  phoneNumber = "5491123456789",
  companyName = "InmoMax",
  properties = [],
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState("welcome")
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    budget: "",
    location: "",
    bedrooms: "",
    message: "",
  })
  const [chatHistory, setChatHistory] = useState([])

  const generateWhatsAppURL = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  const chatFlows = {
    welcome: {
      message: `¡Hola! 👋 Soy el asistente virtual de ${companyName}. ¿En qué puedo ayudarte hoy?`,
      options: [
        { text: "🏠 Ver propiedades disponibles", action: "browse_properties", icon: <Home className="h-4 w-4" /> },
        { text: "💰 Consultar precios", action: "pricing_info", icon: <DollarSign className="h-4 w-4" /> },
        { text: "📅 Agendar una visita", action: "schedule_visit", icon: <Calendar className="h-4 w-4" /> },
        { text: "👨‍💼 Hablar con un agente", action: "contact_agent", icon: <User className="h-4 w-4" /> },
      ],
    },
    browse_properties: {
      message: "¡Perfecto! Para mostrarte las mejores opciones, necesito conocer tus preferencias. ¿Cuál es tu nombre?",
      input: true,
      placeholder: "Tu nombre completo",
      next: "get_property_type",
    },
    get_property_type: {
      message: `Mucho gusto, ${userData.name}! ¿Qué tipo de propiedad estás buscando?`,
      options: [
        { text: "🏠 Casa", action: "set_property_type", value: "casa" },
        { text: "🏢 Departamento", action: "set_property_type", value: "departamento" },
        { text: "🏭 Loft", action: "set_property_type", value: "loft" },
        { text: "🏘️ Casa quinta", action: "set_property_type", value: "quinta" },
      ],
    },
    set_property_type: {
      message: "Excelente elección! ¿Cuál es tu presupuesto aproximado?",
      options: [
        { text: "💵 Hasta $200,000", action: "set_budget", value: "0-200k" },
        { text: "💰 $200,000 - $400,000", action: "set_budget", value: "200k-400k" },
        { text: "💎 $400,000 - $600,000", action: "set_budget", value: "400k-600k" },
        { text: "🏆 Más de $600,000", action: "set_budget", value: "600k+" },
        { text: "🏠 Alquiler hasta $3,000", action: "set_budget", value: "rent-0-3k" },
        { text: "🏢 Alquiler $3,000+", action: "set_budget", value: "rent-3k+" },
      ],
    },
    set_budget: {
      message: "¿En qué zona te gustaría vivir?",
      options: [
        { text: "🏙️ CABA", action: "set_location", value: "caba" },
        { text: "🌳 GBA Norte", action: "set_location", value: "gba-norte" },
        { text: "🏘️ GBA Sur", action: "set_location", value: "gba-sur" },
        { text: "🌅 GBA Oeste", action: "set_location", value: "gba-oeste" },
      ],
    },
    set_location: {
      message: "¿Cuántos dormitorios necesitas?",
      options: [
        { text: "1️⃣ 1 dormitorio", action: "set_bedrooms", value: "1" },
        { text: "2️⃣ 2 dormitorios", action: "set_bedrooms", value: "2" },
        { text: "3️⃣ 3 dormitorios", action: "set_bedrooms", value: "3" },
        { text: "4️⃣ 4+ dormitorios", action: "set_bedrooms", value: "4+" },
      ],
    },
    set_bedrooms: {
      message: "¡Perfecto! He recopilado toda tu información. ¿Cómo te gustaría continuar?",
      options: [
        { text: "📱 Enviar consulta por WhatsApp", action: "send_to_whatsapp" },
        { text: "👀 Ver propiedades ahora", action: "show_properties" },
        { text: "📞 Que me llame un agente", action: "request_call" },
      ],
    },
    pricing_info: {
      message: "Te puedo ayudar con información de precios. ¿Qué necesitas saber?",
      options: [
        { text: "💰 Precios de venta", action: "sale_prices" },
        { text: "🏠 Precios de alquiler", action: "rental_prices" },
        { text: "📊 Tasación gratuita", action: "property_valuation" },
        { text: "📈 Tendencias del mercado", action: "market_trends" },
      ],
    },
    schedule_visit: {
      message: "¡Excelente! Para agendar tu visita necesito algunos datos. ¿Cuál es tu nombre y teléfono?",
      input: true,
      placeholder: "Nombre y teléfono",
      next: "visit_details",
    },
    contact_agent: {
      message: "Te conectaré con uno de nuestros agentes especializados. ¿Cuál es tu consulta?",
      input: true,
      placeholder: "Describe tu consulta...",
      next: "agent_contact",
    },
  }

  const handleUserInput = (input: string) => {
    const newUserData = { ...userData }

    switch (currentStep) {
      case "browse_properties":
        newUserData.name = input
        setCurrentStep("get_property_type")
        break
      case "schedule_visit":
        newUserData.phone = input
        setCurrentStep("visit_details")
        break
      case "contact_agent":
        newUserData.message = input
        setCurrentStep("agent_contact")
        break
    }

    setUserData(newUserData)
  }

  const handleOptionClick = (action: string, value?: string) => {
    const newUserData = { ...userData }

    switch (action) {
      case "set_property_type":
        newUserData.propertyType = value
        setCurrentStep("set_budget")
        break
      case "set_budget":
        newUserData.budget = value
        setCurrentStep("set_location")
        break
      case "set_location":
        newUserData.location = value
        setCurrentStep("set_bedrooms")
        break
      case "set_bedrooms":
        newUserData.bedrooms = value
        setCurrentStep("set_bedrooms")
        break
      case "send_to_whatsapp":
        sendToWhatsApp()
        break
      case "show_properties":
        showProperties()
        break
      case "request_call":
        requestCall()
        break
      default:
        setCurrentStep(action)
    }

    setUserData(newUserData)
  }

  const sendToWhatsApp = () => {
    const message = `¡Hola! Soy ${userData.name} y estoy interesado/a en propiedades con estas características:

🏠 *Tipo de propiedad:* ${userData.propertyType}
💰 *Presupuesto:* ${userData.budget}
📍 *Zona preferida:* ${userData.location}
🛏️ *Dormitorios:* ${userData.bedrooms}

¿Podrían enviarme información sobre propiedades disponibles que coincidan con mis preferencias?

¡Gracias!`

    window.open(generateWhatsAppURL(message), "_blank")
    setIsOpen(false)
  }

  const requestCall = () => {
    const message = `¡Hola! Soy ${userData.name} y me gustaría que un agente me contacte para hablar sobre propiedades.

📞 *Mi teléfono:* ${userData.phone || "Por favor contactarme"}
🏠 *Interesado en:* ${userData.propertyType} en ${userData.location}
💰 *Presupuesto:* ${userData.budget}

¿Podrían llamarme en el horario que les sea conveniente?

¡Gracias!`

    window.open(generateWhatsAppURL(message), "_blank")
    setIsOpen(false)
  }

  const showProperties = () => {
    // This would trigger the parent component to filter and show properties
    setIsOpen(false)
    // Emit event or call parent function
  }

  const getCurrentFlow = () => {
    return chatFlows[currentStep] || chatFlows.welcome
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>

        {/* Notification Badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{companyName} Assistant</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-90">En línea</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 max-h-80 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {/* Bot Message */}
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">{getCurrentFlow().message}</p>
                  </div>
                </div>

                {/* Options */}
                {getCurrentFlow().options && (
                  <div className="space-y-2 ml-10">
                    {getCurrentFlow().options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleOptionClick(option.action, option.value)}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-3 px-4 text-sm hover:bg-green-50 hover:border-green-200 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {option.icon && option.icon}
                          <span>{option.text}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Input Field */}
                {getCurrentFlow().input && (
                  <div className="ml-10">
                    <div className="flex space-x-2">
                      <Input
                        placeholder={getCurrentFlow().placeholder || "Escribe tu respuesta..."}
                        className="flex-1 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.target.value
                            if (input.trim()) {
                              handleUserInput(input)
                              e.target.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="bg-green-500 hover:bg-green-600 h-10 w-10"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector("input").value
                          if (input.trim()) {
                            handleUserInput(input)
                            e.target.parentElement.querySelector("input").value = ""
                          }
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    window.open(generateWhatsAppURL("¡Hola! Me gustaría ver las propiedades disponibles."), "_blank")
                  }
                  variant="ghost"
                  size="sm"
                  className="text-xs justify-start hover:bg-green-50"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver propiedades
                </Button>
                <Button
                  onClick={() => window.open(generateWhatsAppURL("¡Hola! Me gustaría agendar una visita."), "_blank")}
                  variant="ghost"
                  size="sm"
                  className="text-xs justify-start hover:bg-green-50"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Llamar ahora
                </Button>
              </div>

              {/* User Preferences Summary */}
              {(userData.name || userData.propertyType || userData.location) && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800 font-medium mb-1">Tus preferencias:</p>
                  <div className="flex flex-wrap gap-1">
                    {userData.name && (
                      <Badge variant="secondary" className="text-xs">
                        {userData.name}
                      </Badge>
                    )}
                    {userData.propertyType && (
                      <Badge variant="secondary" className="text-xs">
                        {userData.propertyType}
                      </Badge>
                    )}
                    {userData.location && (
                      <Badge variant="secondary" className="text-xs">
                        {userData.location}
                      </Badge>
                    )}
                    {userData.budget && (
                      <Badge variant="secondary" className="text-xs">
                        {userData.budget}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
