
"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Building,
  Home,
  Car,
  Wifi,
  Dumbbell,
  Trees,
  Shield,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Grid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

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

export default function PropiedadesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [operationType, setOperationType] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 6

  useEffect(() => {
    fetch('/api/propiedades')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data);
          setFilteredProperties(data);
        } else {
          setProperties([]);
          setFilteredProperties([]);
          console.error('Error al cargar propiedades:', data.error || data);
        }
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    let filtered = properties

    // Búsqueda por texto
    if (searchQuery) {
      filtered = filtered.filter((property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por tipo de propiedad
    if (propertyType) {
      filtered = filtered.filter((property) => property.type === propertyType)
    }

    // Filtro por tipo de operación
    if (operationType) {
      filtered = filtered.filter((property) => property.type === operationType)
    }

    // Filtro por ubicación
    if (location) {
      filtered = filtered.filter((property) => property.zone === location)
    }

    // Filtro por rango de precio
    filtered = filtered.filter((property) => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    )

    // Filtro por dormitorios
    if (bedrooms) {
      filtered = filtered.filter((property) => property.beds >= parseInt(bedrooms))
    }

    // Filtro por baños
    if (bathrooms) {
      filtered = filtered.filter((property) => property.baths >= parseInt(bathrooms))
    }

    // Ordenamiento
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "area-asc":
          filtered.sort((a, b) => a.area - b.area)
          break
        case "area-desc":
          filtered.sort((a, b) => b.area - a.area)
          break
        case "newest":
          filtered.sort((a, b) => b.yearBuilt - a.yearBuilt)
          break
        case "oldest":
          filtered.sort((a, b) => a.yearBuilt - b.yearBuilt)
          break
      }
    }

    setFilteredProperties(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPropertyType("")
    setOperationType("")
    setLocation("")
    setPriceRange([0, 1000000])
    setBedrooms("")
    setBathrooms("")
    setSortBy("")
    setFilteredProperties(properties)
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

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}k`
    }
    return `$${price.toLocaleString()}`
  }

  // Calcular las propiedades a mostrar en la página actual
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)

  // Funciones para cambiar de página
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Encuentra tu Hogar Perfecto
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Descubre las mejores propiedades en Bahía Blanca y zona sur de Buenos Aires
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Buscar por ubicación, tipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:col-span-2"
                />
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Venta o Alquiler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filtros</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Propiedad
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="local">Local Comercial</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Todas las zonas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="villa-mitre">Villa Mitre</SelectItem>
                      <SelectItem value="palihue">Palihue</SelectItem>
                      <SelectItem value="ingeniero-white">Ingeniero White</SelectItem>
                      <SelectItem value="barrio-norte">Barrio Norte</SelectItem>
                      <SelectItem value="barrio-universitario">Barrio Universitario</SelectItem>
                      <SelectItem value="villa-bordeu">Villa Bordeu</SelectItem>
                      <SelectItem value="villa-harding-green">Villa Harding Green</SelectItem>
                      <SelectItem value="bella-vista">Bella Vista</SelectItem>
                      <SelectItem value="almafuerte">Almafuerte</SelectItem>
                      <SelectItem value="san-martin">San Martín</SelectItem>
                      <SelectItem value="noroeste">Noroeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Precio
                  </label>
                  <div className="px-2 py-4 bg-gray-50 rounded-lg">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={10000}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm font-medium text-blue-600">
                      <span className="bg-white px-2 py-1 rounded shadow-sm">{formatPrice(priceRange[0])}</span>
                      <span className="bg-white px-2 py-1 rounded shadow-sm">{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dormitorios
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Cualquier cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ dormitorio</SelectItem>
                      <SelectItem value="2">2+ dormitorios</SelectItem>
                      <SelectItem value="3">3+ dormitorios</SelectItem>
                      <SelectItem value="4">4+ dormitorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Cualquier cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ baño</SelectItem>
                      <SelectItem value="2">2+ baños</SelectItem>
                      <SelectItem value="3">3+ baños</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                  Aplicar Filtros
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white rounded-lg shadow-sm p-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-lg font-bold">
                      {filteredProperties.length}
                    </span>
                    <span>Propiedades Encontradas</span>
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-600 mt-2 flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Resultados para "<strong>{searchQuery}</strong>"</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="area-asc">Área: Menor a Mayor</SelectItem>
                      <SelectItem value="area-desc">Área: Mayor a Menor</SelectItem>
                      <SelectItem value="newest">Más Nuevas</SelectItem>
                      <SelectItem value="oldest">Más Antiguas</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {currentProperties.map((property) => (
                  <Card key={property.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" onClick={() => openPropertyModal(property)}>
                    <div className="relative overflow-hidden">
                      <img
                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                        alt={property.title || property.description || 'Propiedad'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-600 text-white font-semibold px-3 py-1 shadow-lg">
                        {property.typeText || 'Propiedad'}
                      </Badge>
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Favorito</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm">
                          <Share2 className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">Compartir</span>
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <span className="text-xs font-medium text-gray-700">{property.images?.length || 1} fotos</span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 leading-tight">
                        {property.title || property.description || 'Propiedad sin título'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex items-center font-medium">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {property.location || `${property.street || ''} ${property.city_id || ''}` || 'Sin ubicación'}
                      </p>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-blue-600 mb-1">
                          {property.priceText || (property.price ? `$${property.price.toLocaleString()}` : 'Consultar')}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          {operationType === 'alquiler' ? 'POR MES' : 'PRECIO TOTAL'}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-gray-900">{property.beds ?? '-'}</div>
                          <div className="text-xs text-gray-600 font-medium">Dorm.</div>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-gray-900">{property.baths ?? '-'}</div>
                          <div className="text-xs text-gray-600 font-medium">Baños</div>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg p-2">
                          <div className="text-lg font-bold text-gray-900">{property.area || '-'}</div>
                          <div className="text-xs text-gray-600 font-medium">m²</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(property.features) && property.features.length > 0 ? (
                          property.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                            Consultar detalles
                          </Badge>
                        )}
                        {property.parking > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Cochera
                          </Badge>
                        )}
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg" 
                        onClick={(e) => { e.stopPropagation(); openPropertyModal(property); }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron propiedades</h3>
                  <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 1} 
                    variant="outline"
                    className="px-6 py-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <span className="text-gray-600 font-medium">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages} 
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Property Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <div className="space-y-6">
              {/* Image Gallery */}
              <div className="relative">
                <img
                  src={selectedProperty.images && selectedProperty.images.length > 0 ? selectedProperty.images[currentImageIndex] : '/placeholder.jpg'}
                  alt={selectedProperty.title || selectedProperty.description || 'Propiedad'}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    disabled={
                      !selectedProperty.images || selectedProperty.images.length === 0 || currentImageIndex === 0
                    }
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    disabled={
                      !selectedProperty.images || selectedProperty.images.length === 0 || currentImageIndex === selectedProperty.images.length - 1
                    }
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {selectedProperty.images.length}
                  </div>
                ) : null}
              </div>

              {/* Property Info */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.title || selectedProperty.description || 'Propiedad sin título'}</h2>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedProperty.location || `${selectedProperty.street || ''} ${selectedProperty.city_id || ''}` || 'Sin ubicación'}
                    </p>
                  </div>
                  <Badge className="text-lg px-4 py-2">{selectedProperty.typeText}</Badge>
                </div>

                <p className="text-3xl font-bold text-blue-600 mb-4">{selectedProperty.priceText}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.beds}</div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.baths}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.area}m²</div>
                    <div className="text-sm text-gray-600">Área</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedProperty.parking}</div>
                    <div className="text-sm text-gray-600">Estacionamientos</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedProperty.description}</p>

                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" asChild>
                    <a href="tel:+5491123456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="mailto:info@moralespropiedades.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>

                {selectedProperty.coordinates && selectedProperty.coordinates.lat && selectedProperty.coordinates.lng ? (
                  <div className="my-6">
                    <iframe
                      title="Ubicación en el mapa"
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${selectedProperty.coordinates.lat},${selectedProperty.coordinates.lng}&z=15&output=embed`}
                    ></iframe>
                  </div>
                ) : (
                  <div className="my-6 text-gray-400 text-center">Ubicación no disponible</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
