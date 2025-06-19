
import { useState, useCallback, useMemo } from 'react';
import { Property, PropertyFilters } from '@/types';

export function usePropertyFilters(properties: Property[]) {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const updateFilter = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Filtrar por tipo
      if (filters.type && property.type !== filters.type) {
        return false;
      }

      // Filtrar por estado
      if (filters.status && property.status !== filters.status) {
        return false;
      }

      // Filtrar por precio mínimo
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }

      // Filtrar por precio máximo
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }

      // Filtrar por dormitorios mínimos
      if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) {
        return false;
      }

      // Filtrar por dormitorios máximos
      if (filters.maxBedrooms && property.bedrooms > filters.maxBedrooms) {
        return false;
      }

      // Filtrar por ubicación
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filtrar por área mínima
      if (filters.minArea && property.area < filters.minArea) {
        return false;
      }

      // Filtrar por área máxima
      if (filters.maxArea && property.area > filters.maxArea) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  return {
    filters,
    filteredProperties,
    updateFilter,
    clearFilters,
    hasActiveFilters: Object.keys(filters).length > 0
  };
}
