
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyCardSkeletonProps {
  count?: number;
}

export default function PropertyCardSkeleton({ count = 6 }: PropertyCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <CardContent className="p-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
