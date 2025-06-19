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
  const [amenities, setAmenities] = useState<string[]>([])
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

    // Filtro por amenities
    if (amenities.length > 0) {
      filtered = filtered.filter((property) =>
        amenities.some((amenity) => property.amenities.includes(amenity))
      )
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
    setAmenities([])
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encuentra tu Propiedad Ideal
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explora nuestra amplia selección de propiedades en venta y alquiler en las mejores zonas
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
                  <SelectTrigger>
                    <SelectValue placeholder="Operación" />
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
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las zonas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caba">CABA</SelectItem>
                      <SelectItem value="gba-norte">GBA Norte</SelectItem>
                      <SelectItem value="gba-sur">GBA Sur</SelectItem>
                      <SelectItem value="gba-oeste">GBA Oeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Precio
                  </label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={10000}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dormitorios
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Cualquier cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ baño</SelectItem>
                      <SelectItem value="2">2+ baños</SelectItem>
                      <SelectItem value="3">3+ baños</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {["Garage", "Piscina", "Gimnasio", "Seguridad 24hs", "Balcón", "Terraza"].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAmenities([...amenities, amenity])
                            } else {
                              setAmenities(amenities.filter((a) => a !== amenity))
                            }
                          }}
                        />
                        <label htmlFor={amenity} className="text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredProperties.length} Propiedades Encontradas
                  </h2>
                  <p className="text-gray-600">
                    {searchQuery && `Resultados para "${searchQuery}"`}
                  </p>
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
                  <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPropertyModal(property)}>
                    <div className="relative">
                      <img
                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                        alt={property.title || property.description || 'Propiedad'}
                        className="w-full h-48 object-cover rounded-t-lg bg-gray-100"
                      />
                      <Badge className="absolute top-2 left-2">
                        {property.typeText || 'Propiedad'}
                      </Badge>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                          <span className="sr-only">Favorito</span>
                          ♥
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                          <span className="sr-only">Compartir</span>
                          ↗
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{property.title || property.description || 'Propiedad sin título'}</h3>
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        📍 {property.location || `${property.street || ''} ${property.city_id || ''}` || 'Sin ubicación'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        {property.priceText || (property.price ? `$${property.price}` : 'Consultar')}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">🛏️ {property.beds ?? '-'}</span>
                          <span className="flex items-center">🛁 {property.baths ?? '-'}</span>
                          <span className="flex items-center">📐 {property.area ? `${property.area}m²` : '-'}</span>
                        </div>
                        {property.parking > 0 && (
                          <span className="flex items-center">🚗 {property.parking}</span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(property.features) && property.features.length > 0 ? (
                          property.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">Sin características</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                        {property.description || 'Sin descripción'}
                      </div>
                      <Button className="mt-4 w-full" onClick={(e) => { e.stopPropagation(); openPropertyModal(property); }}>
                        Más información
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

              {/* Controles de paginación debajo de la grid */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button onClick={goToPrevPage} disabled={currentPage === 1} variant="outline">
                  Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="outline">
                  Siguiente
                </Button>
              </div>
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

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.isArray(selectedProperty.amenities) && selectedProperty.amenities.length > 0 ? (
                      selectedProperty.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Sin amenities</span>
                    )}
                  </div>
                </div>

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