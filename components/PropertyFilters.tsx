
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFilters, PropertyType, PropertyStatus } from '@/types';
import { Filter, X } from 'lucide-react';

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'local', label: 'Local' },
  { value: 'oficina', label: 'Oficina' }
];

const propertyStatuses: { value: PropertyStatus; label: string }[] = [
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' }
];

export default function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  className = ""
}: PropertyFiltersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tipo de propiedad */}
        <div className="space-y-2">
          <Label htmlFor="property-type">Tipo de propiedad</Label>
          <Select
            value={filters.type || ""}
            onValueChange={(value) => onFilterChange('type', value as PropertyType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="property-status">Estado</Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => onFilterChange('status', value as PropertyStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Venta o Alquiler" />
            </SelectTrigger>
            <SelectContent>
              {propertyStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <Label>Precio</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Precio mín."
                value={filters.minPrice || ""}
                onChange={(e) => onFilterChange('minPrice', Number(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Precio máx."
                value={filters.maxPrice || ""}
                onChange={(e) => onFilterChange('maxPrice', Number(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>

        {/* Dormitorios */}
        <div className="space-y-2">
          <Label>Dormitorios</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Mín."
                value={filters.minBedrooms || ""}
                onChange={(e) => onFilterChange('minBedrooms', Number(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Máx."
                value={filters.maxBedrooms || ""}
                onChange={(e) => onFilterChange('maxBedrooms', Number(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            placeholder="Buscar por ubicación..."
            value={filters.location || ""}
            onChange={(e) => onFilterChange('location', e.target.value || undefined)}
          />
        </div>

        {/* Área */}
        <div className="space-y-2">
          <Label>Área (m²)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Área mín."
                value={filters.minArea || ""}
                onChange={(e) => onFilterChange('minArea', Number(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Área máx."
                value={filters.maxArea || ""}
                onChange={(e) => onFilterChange('maxArea', Number(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
