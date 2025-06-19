"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  Award,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  ChevronLeft,
  ChevronRightIcon,
  MapPinIcon,
  Calendar,
  Home,
  Car,
  Wifi,
  Dumbbell,
  Trees,
  MessageCircle,
  Send,
  Eye,
  Building,
  FileText,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Property {
  id: number
  title: string
  location: string
  price: number
  priceText: string
  beds: number
  baths: number
  area: number
  type: string
  typeText: string
  zone: string
  images: string[]
  description: string
  yearBuilt: number
  parking: number
  coordinates: { lat: number; lng: number }
  amenities: string[]
  features: string[]
}

interface UserPreferences {
  name: string
  phone: string
  propertyType: string
  budget: string
  location: string
  bedrooms: string
}

export default function InmobiliariaPage() {
  const router = useRouter()
  const [searchType, setSearchType] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [searchPrice, setSearchPrice] = useState("")
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contactSubject, setContactSubject] = useState("")

  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [chatStep, setChatStep] = useState("welcome")
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: "",
    phone: "",
    propertyType: "",
    budget: "",
    location: "",
    bedrooms: "",
  })
  const [chatMessages, setChatMessages] = useState<string[]>([])

  const allProperties: Property[] = [
    {
      id: 1,
      title: "Casa Moderna en Zona Norte",
      location: "Belgrano, CABA",
      price: 450000,
      priceText: "$450,000",
      beds: 3,
      baths: 2,
      area: 120,
      type: "venta",
      typeText: "Venta",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Casa+Moderna+1",
        "/placeholder.svg?height=400&width=600&text=Casa+Moderna+2",
        "/placeholder.svg?height=400&width=600&text=Casa+Moderna+3",
        "/placeholder.svg?height=400&width=600&text=Casa+Moderna+4",
      ],
      description:
        "Hermosa casa moderna de 3 dormitorios en el corazón de Belgrano. Cuenta con amplios espacios, cocina integrada con isla, living comedor con grandes ventanales que brindan mucha luminosidad natural. Patio trasero ideal para reuniones familiares. Excelente ubicación cerca de transporte público y centros comerciales.",
      yearBuilt: 2019,
      parking: 2,
      coordinates: { lat: -34.5631, lng: -58.4544 },
      amenities: ["Cocina integrada", "Patio", "Parrilla", "Lavadero", "Aire acondicionado"],
      features: ["Luminosa", "Moderna", "Cerca del transporte"],
    },
    {
      id: 2,
      title: "Departamento Luminoso",
      location: "Palermo, CABA",
      price: 2800,
      priceText: "$2,800/mes",
      beds: 2,
      baths: 1,
      area: 85,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Depto+Palermo+1",
        "/placeholder.svg?height=400&width=600&text=Depto+Palermo+2",
        "/placeholder.svg?height=400&width=600&text=Depto+Palermo+3",
      ],
      description:
        "Departamento de 2 ambientes en el vibrante barrio de Palermo. Totalmente amueblado y equipado, ideal para profesionales jóvenes. Cuenta con balcón, cocina completa y baño renovado. Edificio con portero y ascensor. A pasos de restaurantes, bares y vida nocturna.",
      yearBuilt: 2015,
      parking: 0,
      coordinates: { lat: -34.5875, lng: -58.4205 },
      amenities: ["Amueblado", "Balcón", "Portero", "Ascensor", "Calefacción"],
      features: ["Céntrico", "Amueblado", "Vida nocturna"],
    },
    {
      id: 3,
      title: "Casa con Jardín",
      location: "San Isidro, GBA",
      price: 380000,
      priceText: "$380,000",
      beds: 4,
      baths: 3,
      area: 180,
      type: "venta",
      typeText: "Venta",
      zone: "gba-norte",
      images: [
        "/placeholder.svg?height=400&width=600&text=Casa+San+Isidro+1",
        "/placeholder.svg?height=400&width=600&text=Casa+San+Isidro+2",
        "/placeholder.svg?height=400&width=600&text=Casa+San+Isidro+3",
        "/placeholder.svg?height=400&width=600&text=Casa+San+Isidro+4",
        "/placeholder.svg?height=400&width=600&text=Casa+San+Isidro+5",
      ],
      description:
        "Espectacular casa familiar en San Isidro con amplio jardín y pileta. 4 dormitorios, 3 baños, living comedor, cocina completa y quincho. Ideal para familias que buscan tranquilidad sin alejarse de la ciudad. Garage para 2 autos y depósito.",
      yearBuilt: 2010,
      parking: 2,
      coordinates: { lat: -34.4708, lng: -58.5067 },
      amenities: ["Pileta", "Jardín", "Quincho", "Garage", "Depósito", "Parrilla"],
      features: ["Familiar", "Pileta", "Zona tranquila"],
    },
    {
      id: 4,
      title: "Loft Industrial",
      location: "Puerto Madero, CABA",
      price: 3500,
      priceText: "$3,500/mes",
      beds: 1,
      baths: 1,
      area: 65,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Loft+Industrial+1",
        "/placeholder.svg?height=400&width=600&text=Loft+Industrial+2",
        "/placeholder.svg?height=400&width=600&text=Loft+Industrial+3",
      ],
      description:
        "Moderno loft de estilo industrial en Puerto Madero. Techos altos, grandes ventanales con vista al río, cocina integrada de diseño y baño completo. Edificio de lujo con amenities: gimnasio, piscina, solarium y seguridad 24hs.",
      yearBuilt: 2018,
      parking: 1,
      coordinates: { lat: -34.6118, lng: -58.3636 },
      amenities: ["Vista al río", "Gimnasio", "Piscina", "Solarium", "Seguridad 24hs", "Aire acondicionado"],
      features: ["Moderno", "Vista al río", "Amenities"],
    },
    {
      id: 5,
      title: "Casa Familiar",
      location: "Tigre, GBA",
      price: 320000,
      priceText: "$320,000",
      beds: 3,
      baths: 2,
      area: 150,
      type: "venta",
      typeText: "Venta",
      zone: "gba-norte",
      images: [
        "/placeholder.svg?height=400&width=600&text=Casa+Tigre+1",
        "/placeholder.svg?height=400&width=600&text=Casa+Tigre+2",
        "/placeholder.svg?height=400&width=600&text=Casa+Tigre+3",
      ],
      description:
        "Casa familiar en Tigre, perfecta para quienes buscan tranquilidad y contacto con la naturaleza. 3 dormitorios, 2 baños, living comedor, cocina y lavadero. Amplio terreno con árboles frutales. Cerca de escuelas y centros comerciales.",
      yearBuilt: 2008,
      parking: 1,
      coordinates: { lat: -34.4264, lng: -58.5739 },
      amenities: ["Jardín amplio", "Árboles frutales", "Lavadero", "Terreno grande"],
      features: ["Tranquila", "Natural", "Familiar"],
    },
    {
      id: 6,
      title: "Penthouse de Lujo",
      location: "Recoleta, CABA",
      price: 5200,
      priceText: "$5,200/mes",
      beds: 3,
      baths: 2,
      area: 140,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Penthouse+1",
        "/placeholder.svg?height=400&width=600&text=Penthouse+2",
        "/placeholder.svg?height=400&width=600&text=Penthouse+3",
      ],
      description:
        "Exclusivo penthouse en Recoleta con vista panorámica de la ciudad. 3 dormitorios en suite, living comedor de doble altura, cocina gourmet y terraza privada. Edificio de lujo con todos los servicios y seguridad 24hs.",
      yearBuilt: 2020,
      parking: 2,
      coordinates: { lat: -34.5895, lng: -58.3814 },
      amenities: ["Terraza", "Vista panorámica", "Cocina gourmet", "Seguridad 24hs", "Concierge"],
      features: ["Exclusivo", "Vista panorámica", "Lujo"],
    },
    {
      id: 7,
      title: "Departamento en Torre",
      location: "Belgrano, CABA",
      price: 1800,
      priceText: "$1,800/mes",
      beds: 1,
      baths: 1,
      area: 45,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Torre+Belgrano+1",
        "/placeholder.svg?height=400&width=600&text=Torre+Belgrano+2",
      ],
      description:
        "Monoambiente en torre moderna de Belgrano. Ideal para estudiantes o profesionales. Cocina integrada, baño completo y balcón. Edificio con amenities.",
      yearBuilt: 2017,
      parking: 0,
      coordinates: { lat: -34.5631, lng: -58.4544 },
      amenities: ["Balcón", "Amenities", "Seguridad"],
      features: ["Moderno", "Céntrico", "Funcional"],
    },
    {
      id: 8,
      title: "Casa Quinta",
      location: "Pilar, GBA",
      price: 280000,
      priceText: "$280,000",
      beds: 5,
      baths: 4,
      area: 250,
      type: "venta",
      typeText: "Venta",
      zone: "gba-norte",
      images: [
        "/placeholder.svg?height=400&width=600&text=Quinta+Pilar+1",
        "/placeholder.svg?height=400&width=600&text=Quinta+Pilar+2",
        "/placeholder.svg?height=400&width=600&text=Quinta+Pilar+3",
      ],
      description:
        "Casa quinta en Pilar con amplio parque y pileta. 5 dormitorios, 4 baños, quincho y garage para 3 autos. Ideal para descanso familiar.",
      yearBuilt: 2005,
      parking: 3,
      coordinates: { lat: -34.4587, lng: -58.9142 },
      amenities: ["Pileta", "Quincho", "Parque amplio", "Garage triple"],
      features: ["Quinta", "Pileta", "Parque"],
    },
    {
      id: 9,
      title: "Estudio Moderno",
      location: "Villa Crespo, CABA",
      price: 1500,
      priceText: "$1,500/mes",
      beds: 1,
      baths: 1,
      area: 35,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Estudio+Villa+Crespo+1",
        "/placeholder.svg?height=400&width=600&text=Estudio+Villa+Crespo+2",
      ],
      description:
        "Estudio moderno y funcional en Villa Crespo. Perfecto para jóvenes profesionales. Cocina integrada y baño completo.",
      yearBuilt: 2016,
      parking: 0,
      coordinates: { lat: -34.5997, lng: -58.4317 },
      amenities: ["Cocina integrada", "Moderno", "Funcional"],
      features: ["Compacto", "Moderno", "Accesible"],
    },
    {
      id: 10,
      title: "Casa de Diseño",
      location: "La Plata, GBA",
      price: 420000,
      priceText: "$420,000",
      beds: 3,
      baths: 2,
      area: 160,
      type: "venta",
      typeText: "Venta",
      zone: "gba-sur",
      images: [
        "/placeholder.svg?height=400&width=600&text=Casa+La+Plata+1",
        "/placeholder.svg?height=400&width=600&text=Casa+La+Plata+2",
        "/placeholder.svg?height=400&width=600&text=Casa+La+Plata+3",
      ],
      description:
        "Casa de diseño contemporáneo en La Plata. 3 dormitorios, 2 baños, living integrado y patio con deck. Terminaciones de primera calidad.",
      yearBuilt: 2021,
      parking: 2,
      coordinates: { lat: -34.9214, lng: -57.9544 },
      amenities: ["Diseño contemporáneo", "Deck", "Terminaciones premium"],
      features: ["Diseño", "Contemporáneo", "Premium"],
    },
    {
      id: 11,
      title: "Departamento Premium",
      location: "Barrio Norte, CABA",
      price: 4200,
      priceText: "$4,200/mes",
      beds: 2,
      baths: 2,
      area: 95,
      type: "alquiler",
      typeText: "Alquiler",
      zone: "caba",
      images: [
        "/placeholder.svg?height=400&width=600&text=Depto+Premium+1",
        "/placeholder.svg?height=400&width=600&text=Depto+Premium+2",
        "/placeholder.svg?height=400&width=600&text=Depto+Premium+3",
      ],
      description:
        "Departamento premium en Barrio Norte. 2 dormitorios en suite, living comedor amplio, cocina completa y balcón. Edificio de categoría con amenities.",
      yearBuilt: 2019,
      parking: 1,
      coordinates: { lat: -34.5875, lng: -58.3974 },
      amenities: ["Suites", "Balcón", "Amenities", "Categoría"],
      features: ["Premium", "Céntrico", "Amenities"],
    },
    {
      id: 12,
      title: "Casa con Pileta",
      location: "Morón, GBA",
      price: 350000,
      priceText: "$350,000",
      beds: 4,
      baths: 3,
      area: 200,
      type: "venta",
      typeText: "Venta",
      zone: "gba-oeste",
      images: [
        "/placeholder.svg?height=400&width=600&text=Casa+Moron+1",
        "/placeholder.svg?height=400&width=600&text=Casa+Moron+2",
        "/placeholder.svg?height=400&width=600&text=Casa+Moron+3",
      ],
      description:
        "Casa familiar con pileta en Morón. 4 dormitorios, 3 baños, living comedor, cocina completa y quincho. Garage para 2 autos y jardín.",
      yearBuilt: 2012,
      parking: 2,
      coordinates: { lat: -34.6534, lng: -58.6198 },
      amenities: ["Pileta", "Quincho", "Jardín", "Garage doble"],
      features: ["Familiar", "Pileta", "Quincho"],
    },
  ]

  // Cargar propiedades desde la API (mismas que en /propiedades)
  useEffect(() => {
    fetch('/api/propiedades')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Mostrar las 6 más recientes en la página principal
          const recentProperties = data.slice(0, 6);
          setFilteredProperties(recentProperties);
        } else {
          // Si no hay datos de la API, usar propiedades de ejemplo
          setFilteredProperties(allProperties.slice(0, 6));
        }
      })
      .catch(() => {
        // En caso de error, usar propiedades de ejemplo
        setFilteredProperties(allProperties.slice(0, 6));
      });
  }, [])

  const getPriceRange = (priceRange: string) => {
    switch (priceRange) {
      case "0-200k":
        return { min: 0, max: 200000 }
      case "200k-400k":
        return { min: 200000, max: 400000 }
      case "400k-600k":
        return { min: 400000, max: 600000 }
      case "600k+":
        return { min: 600000, max: Number.POSITIVE_INFINITY }
      case "0-2k":
        return { min: 0, max: 2000 }
      case "2k-4k":
        return { min: 2000, max: 4000 }
      case "4k+":
        return { min: 4000, max: Number.POSITIVE_INFINITY }
      default:
        return { min: 0, max: Number.POSITIVE_INFINITY }
    }
  }

  const handleSearch = () => {
    let filtered = allProperties

    // Filtrar por tipo de operación
    if (searchType) {
      filtered = filtered.filter((property) => property.type === searchType)
    }

    // Filtrar por ubicación
    if (searchLocation) {
      filtered = filtered.filter((property) => property.zone === searchLocation)
    }

    // Filtrar por precio
    if (searchPrice) {
      const { min, max } = getPriceRange(searchPrice)
      filtered = filtered.filter((property) => property.price >= min && property.price <= max)
    }

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchType("")
    setSearchLocation("")
    setSearchPrice("")
    setFilteredProperties(allProperties.slice(0, 6))
  }

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property)
    setCurrentImageIndex(0)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProperty && currentImageIndex < selectedProperty.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("garage") || amenityLower.includes("parking")) return <Car className="h-4 w-4" />
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes("gimnasio") || amenityLower.includes("gym")) return <Dumbbell className="h-4 w-4" />
    if (amenityLower.includes("seguridad") || amenityLower.includes("security")) return <Shield className="h-4 w-4" />
    if (amenityLower.includes("jardín") || amenityLower.includes("parque") || amenityLower.includes("pileta"))
      return <Trees className="h-4 w-4" />
    return <Home className="h-4 w-4" />
  }

  const getResultsText = () => {
    const total = filteredProperties.length
    if (total === 0) return "No se encontraron propiedades"
    if (total === 1) return "1 propiedad encontrada"
    return `${total} propiedades encontradas`
  }

  const whatsappNumber = "5491123456789" // Replace with actual WhatsApp number

  const generateWhatsAppLink = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  }

  const getChatbotResponse = (step: string, userInput = "") => {
    const responses: Record<string, any> = {
      welcome: {
        message: "¡Hola! 👋 Soy el asistente virtual de InmoMax. ¿En qué puedo ayudarte hoy?",
        options: [
          { text: "Ver propiedades disponibles", action: "browse_properties" },
          { text: "Consultar precios", action: "pricing" },
          { text: "Agendar una visita", action: "schedule_visit" },
          { text: "Hablar con un agente", action: "contact_agent" },
        ],
      },
      browse_properties: {
        message:
          "Perfecto! Para mostrarte las mejores opciones, necesito conocer tus preferencias. ¿Cuál es tu nombre?",
        input: true,
        next: "get_name",
      },
      get_name: {
        message: `Mucho gusto, ${userInput}! ¿Qué tipo de propiedad buscas?`,
        options: [
          { text: "Casa", action: "property_type", value: "casa" },
          { text: "Departamento", action: "property_type", value: "departamento" },
          { text: "Loft", action: "property_type", value: "loft" },
        ],
      },
      property_type: {
        message: "Excelente elección! ¿Cuál es tu presupuesto aproximado?",
        options: [
          { text: "Hasta $300,000", action: "budget", value: "0-300k" },
          { text: "$300,000 - $500,000", action: "budget", value: "300k-500k" },
          { text: "Más de $500,000", action: "budget", value: "500k+" },
          { text: "Alquiler hasta $3,000", action: "budget", value: "rent-3k" },
          { text: "Alquiler más de $3,000", action: "budget", value: "rent-3k+" },
        ],
      },
      budget: {
        message: "¿En qué zona te gustaría vivir?",
        options: [
          { text: "CABA", action: "location", value: "caba" },
          { text: "GBA Norte", action: "location", value: "gba-norte" },
          { text: "GBA Sur", action: "location", value: "gba-sur" },
          { text: "GBA Oeste", action: "location", value: "gba-oeste" },
        ],
      },
      location: {
        message: "¿Cuántos dormitorios necesitas?",
        options: [
          { text: "1 dormitorio", action: "bedrooms", value: "1" },
          { text: "2 dormitorios", action: "bedrooms", value: "2" },
          { text: "3 dormitorios", action: "bedrooms", value: "3" },
          { text: "4+ dormitorios", action: "bedrooms", value: "4+" },
        ],
      },
      bedrooms: {
        message:
          "¡Perfecto! He encontrado algunas propiedades que podrían interesarte. ¿Te gustaría que te envíe la información por WhatsApp?",
        options: [
          { text: "Sí, enviar por WhatsApp", action: "send_whatsapp" },
          { text: "Ver propiedades ahora", action: "show_properties" },
        ],
      },
      pricing: {
        message: "Te puedo ayudar con información de precios. ¿Qué tipo de consulta tienes?",
        options: [
          { text: "Precios de venta", action: "sale_prices" },
          { text: "Precios de alquiler", action: "rent_prices" },
          { text: "Tasación de propiedad", action: "property_valuation" },
        ],
      },
      schedule_visit: {
        message: "¡Excelente! Para agendar una visita necesito algunos datos. ¿Cuál es tu nombre y teléfono?",
        input: true,
        next: "visit_contact",
      },
      contact_agent: {
        message: "Te conectaré con uno de nuestros agentes especializados. ¿Cuál es tu consulta específica?",
        input: true,
        next: "agent_query",
      },
    }

    return responses[step] || responses.welcome
  }

  const handleChatOption = (action: string, value = "", input = "") => {
    const newPreferences = { ...userPreferences }
    let nextStep = action

    switch (action) {
      case "get_name":
        newPreferences.name = input
        nextStep = "property_type"
        break
      case "property_type":
        newPreferences.propertyType = value
        nextStep = "budget"
        break
      case "budget":
        newPreferences.budget = value
        nextStep = "location"
        break
      case "location":
        newPreferences.location = value
        nextStep = "bedrooms"
        break
      case "bedrooms":
        newPreferences.bedrooms = value
        nextStep = "bedrooms"
        break
      case "send_whatsapp":
        sendToWhatsApp()
        return
      case "show_properties":
        showFilteredProperties()
        return
    }

    setUserPreferences(newPreferences)
    setChatStep(nextStep)
  }

  const sendToWhatsApp = () => {
    const message = `Hola! Soy ${userPreferences.name} y estoy interesado en propiedades con las siguientes características:

🏠 Tipo: ${userPreferences.propertyType}
💰 Presupuesto: ${userPreferences.budget}
📍 Zona: ${userPreferences.location}
🛏️ Dormitorios: ${userPreferences.bedrooms}

¿Podrían enviarme información sobre propiedades disponibles?`

    window.open(generateWhatsAppLink(message), "_blank")
    setIsWhatsAppOpen(false)
  }

  const showFilteredProperties = () => {
    // Filter properties based on user preferences
    const filtered = allProperties.filter((property) => {
      if (userPreferences.location && property.zone !== userPreferences.location) return false
      if (userPreferences.bedrooms && userPreferences.bedrooms !== "4+") {
        if (Number.parseInt(userPreferences.bedrooms) !== property.beds) return false
      } else if (userPreferences.bedrooms === "4+" && property.beds < 4) {
        return false
      }
      return true
    })

    setFilteredProperties(filtered)
    setIsWhatsAppOpen(false)

    // Scroll to properties section
    document.getElementById("propiedades")?.scrollIntoView({ behavior: "smooth" })
  }

  const openWhatsAppChat = () => {
    setIsWhatsAppOpen(true)
    setChatStep("welcome")
    setChatMessages([])
  }

  const services = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Búsqueda Personalizada",
      description: "Te ayudamos a encontrar la propiedad perfecta según tus necesidades y presupuesto.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Asesoramiento Legal",
      description: "Contamos con un equipo legal especializado para garantizar transacciones seguras.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Atención Personalizada",
      description: "Un agente dedicado te acompañará durante todo el proceso de compra o alquiler.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Tasaciones Profesionales",
      description: "Realizamos tasaciones precisas con certificación profesional para tu propiedad.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section with Search */}
      <section id="inicio" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Encuentra tu
              <span className="text-blue-600 block">hogar ideal</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
              Más de 15 años ayudando a familias a encontrar la propiedad perfecta
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                  <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchLocation} onValueChange={setSearchLocation}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caba">CABA</SelectItem>
                  <SelectItem value="gba-norte">GBA Norte</SelectItem>
                  <SelectItem value="gba-sur">GBA Sur</SelectItem>
                  <SelectItem value="gba-oeste">GBA Oeste</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchPrice} onValueChange={setSearchPrice}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  {searchType === "venta" ? (
                    <>
                      <SelectItem value="0-200k">Hasta $200,000</SelectItem>
                      <SelectItem value="200k-400k">$200,000 - $400,000</SelectItem>
                      <SelectItem value="400k-600k">$400,000 - $600,000</SelectItem>
                      <SelectItem value="600k+">Más de $600,000</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="0-2k">Hasta $2,000/mes</SelectItem>
                      <SelectItem value="2k-4k">$2,000 - $4,000/mes</SelectItem>
                      <SelectItem value="4k+">Más de $4,000/mes</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                className="h-12 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Button>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => router.push('/propiedades')} 
                variant="ghost" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Ver Todas las Propiedades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="propiedades" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {searchType || searchLocation || searchPrice ? "Resultados de Búsqueda" : "Propiedades Destacadas"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              {searchType || searchLocation || searchPrice
                ? getResultsText()
                : "Descubre nuestra selección de propiedades premium en las mejores ubicaciones"}
            </p>
            {(searchType || searchLocation || searchPrice) && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {searchType && (
                  <Badge variant="secondary" className="text-sm">
                    {searchType === "venta" ? "Venta" : "Alquiler"}
                  </Badge>
                )}
                {searchLocation && (
                  <Badge variant="secondary" className="text-sm">
                    {searchLocation === "caba"
                      ? "CABA"
                      : searchLocation === "gba-norte"
                        ? "GBA Norte"
                        : searchLocation === "gba-sur"
                          ? "GBA Sur"
                          : "GBA Oeste"}
                  </Badge>
                )}
                {searchPrice && (
                  <Badge variant="secondary" className="text-sm">
                    {searchPrice}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <Card
                  key={property.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge
                      className={`absolute top-4 left-4 ${property.type === "venta" ? "bg-green-500" : "bg-blue-500"}`}
                    >
                      {property.typeText}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.beds}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.baths}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{property.priceText}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                      onClick={() => openPropertyModal(property)}
                    >
                      Ver más
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
              <p className="text-gray-600 mb-6">Intenta ajustar los filtros de búsqueda para encontrar más opciones</p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos un servicio integral para todas tus necesidades inmobiliarias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sobre Morales Propiedades
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más de 15 años de experiencia en el mercado inmobiliario, ayudando a familias a encontrar su hogar ideal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Experiencia</h3>
              <p className="text-gray-600">
                15+ años en el mercado inmobiliario con miles de familias satisfechas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confianza</h3>
              <p className="text-gray-600">
                Transparencia total en cada transacción, con la confianza de nuestros clientes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excelencia</h3>
              <p className="text-gray-600">
                Servicio de calidad premium con atención personalizada en cada caso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos aquí para ayudarte a encontrar tu hogar ideal. ¡Conversemos!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-gray-900">Teléfono</p>
                      <p className="text-gray-600">+54 9 11 2345-6789</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@moralespropiedades.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-gray-900">Oficina</p>
                      <p className="text-gray-600">Av. Corrientes 1234, CABA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-gray-900">Horarios</p>
                      <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-gray-600">Sábados: 9:00 - 13:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contacto Rápido</h3>
                
                <div className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <a href="tel:+5491123456789" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar ahora
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="mailto:info@moralespropiedades.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar email
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Envíanos tu consulta</h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <Input
                      required
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <Input
                      placeholder="+54 9 11 2345-6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <Select value={contactSubject} onValueChange={setContactSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un asunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consulta-propiedad">Consulta sobre propiedad</SelectItem>
                      <SelectItem value="tasacion">Tasación gratuita</SelectItem>
                      <SelectItem value="visita">Agendar visita</SelectItem>
                      <SelectItem value="venta">Vender mi propiedad</SelectItem>
                      <SelectItem value="alquiler">Alquilar mi propiedad</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <Textarea
                    required
                    placeholder="Cuéntanos más sobre lo que buscas..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* Property Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProperty && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image Gallery */}
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                <img
                  src={selectedProperty.images[currentImageIndex] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {selectedProperty.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === selectedProperty.images.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedProperty.images.length}
                </div>

                {/* Property Type Badge */}
                <Badge
                  className={`absolute top-4 left-4 ${selectedProperty.type === "venta" ? "bg-green-500" : "bg-blue-500"}`}
                >
                  {selectedProperty.typeText}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h2>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span className="text-lg">{selectedProperty.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{selectedProperty.priceText}</div>
                    <div className="text-sm text-gray-500">
                      {selectedProperty.type === "venta" ? "Precio de venta" : "Precio mensual"}
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bed className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.beds}</div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bath className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.baths}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Square className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.area}</div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Car className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.parking}</div>
                    <div className="text-sm text-gray-600">Cocheras</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="space-y-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {getAmenityIcon(amenity)}
                          <span className="text-gray-600">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Info */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Información</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">Año de construcción: {selectedProperty.yearBuilt}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Home className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">Tipo: {selectedProperty.typeText}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">Zona: {selectedProperty.zone.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Características Destacadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Ubicación</h3>
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Placeholder Map */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <div className="text-center">
                        <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg font-semibold text-gray-900">{selectedProperty.location}</div>
                        <div className="text-sm text-gray-600">
                          Lat: {selectedProperty.coordinates.lat}, Lng: {selectedProperty.coordinates.lng}
                        </div>
                      </div>
                    </div>
                    {/* In a real implementation, you would integrate with Google Maps, Mapbox, or similar */}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-5 w-5 mr-2" />
                    Contactar Agente
                  </Button>
                  <Button variant="outline" className="flex-1 h-12">
                    <Mail className="h-5 w-5 mr-2" />
                    Solicitar Información
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openWhatsAppChat}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* WhatsApp Chat Modal */}
      {isWhatsAppOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">InmoMax Assistant</h3>
                  <p className="text-sm opacity-90">En línea</p>
                </div>
              </div>
              <Button
                onClick={() => setIsWhatsAppOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Bot Message */}
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">{getChatbotResponse(chatStep).message}</p>
                  </div>
                </div>

                {/* Options */}
                {getChatbotResponse(chatStep).options && (
                  <div className="space-y-2 ml-10">
                    {getChatbotResponse(chatStep).options.map((option: any, index: number) => (
                      <Button
                        key={index}
                        onClick={() => handleChatOption(option.action, option.value)}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 px-3 text-sm hover:bg-green-50 hover:border-green-200"
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Input Field */}
                {getChatbotResponse(chatStep).input && (
                  <div className="ml-10">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 text-sm"
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            const input = (e.target as HTMLInputElement).value
                            if (input.trim()) {
                              handleChatOption(getChatbotResponse(chatStep).next, "", input)
                              ;(e.target as HTMLInputElement).value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="bg-green-500 hover:bg-green-600 h-10 w-10"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                          if (input && input.value.trim()) {
                            handleChatOption(getChatbotResponse(chatStep).next, "", input.value)
                            input.value = ""
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

            {/* Quick Actions */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() =>
                    window.open(
                      generateWhatsAppLink(
                        "Hola! Me gustaría obtener más información sobre sus propiedades disponibles.",
                      ),
                      "_blank",
                    )
                  }
                  variant="ghost"
                  size="sm"
                  className="text-xs justify-start"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver propiedades
                </Button>
                <Button
                  onClick={() =>
                    window.open(generateWhatsAppLink("Hola! Me gustaría agendar una visita a una propiedad."), "_blank")
                  }
                  variant="ghost"
                  size="sm"
                  className="text-xs justify-start"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Agendar visita
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
