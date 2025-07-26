'use client';

import { usePlants } from '@/hooks/usePlants';
import PlantCard from '@/components/PlantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { plants, removePlant, isInitialized } = usePlants();
  const { toast } = useToast();

  const handleRemovePlant = (plantId: string, plantName: string) => {
    removePlant(plantId);
    toast({
      title: 'Plant Removed',
      description: `${plantName} has been removed from your collection.`,
      variant: 'destructive',
    });
  };

  if (!isInitialized) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Plants</h1>
        <Button asChild>
          <Link href="/add-plant">Add Plant</Link>
        </Button>
      </div>
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onRemovePlant={handleRemovePlant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-bold">Welcome to Verdant Minder!</h2>
          <p className="text-muted-foreground mb-4">You haven't added any plants yet.</p>
          <Button asChild>
            <Link href="/add-plant">Add Your First Plant</Link>
          </Button>
        </div>
      )}
    </div>
  );
}