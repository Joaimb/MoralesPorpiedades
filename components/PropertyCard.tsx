
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/types';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onToggleFavorite?: (propertyId: string) => void;
  isFavorite?: boolean;
  showStatus?: boolean;
  className?: string;
}

export default function PropertyCard({ 
  property, 
  onViewDetails, 
  onToggleFavorite,
  isFavorite = false,
  showStatus = true,
  className = ""
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'venta': return 'bg-blue-500';
      case 'alquiler': return 'bg-green-500';
      case 'vendido': return 'bg-gray-500';
      case 'alquilado': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative">
        <Image
          src={property.images[0] || '/placeholder.jpg'}
          alt={property.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {showStatus && (
          <Badge 
            className={`absolute top-2 left-2 text-white ${getStatusColor(property.status)}`}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        )}

        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
            onClick={() => onToggleFavorite(property.id)}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area}m²</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(property)}
              >
                Ver detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
