'use client';

import { useParams } from 'next/navigation';
import { usePlants } from '@/hooks/usePlants';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import CareSchedule from '@/components/CareSchedule';
import CareLog from '@/components/CareLog';
import Link from 'next/link';

export default function PlantDetailPage() {
  const params = useParams();
  const { id } = params;
  const { getPlantById, isInitialized } = usePlants();

  const plantId = Array.isArray(id) ? id[0] : id;
  const plant = getPlantById(plantId);

  if (!isInitialized) {
    return <PlantDetailSkeleton />;
  }

  if (!plant) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Plant not found</h2>
        <p className="text-muted-foreground mt-2">The plant you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="p-0">
            <div className="aspect-square relative">
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint="plant"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold">{plant.name}</h1>
            <Badge variant="secondary" className="mt-2">{plant.type}</Badge>
            <p className="text-muted-foreground mt-4">{plant.description}</p>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Tabs defaultValue="schedule">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Care Schedule</TabsTrigger>
            <TabsTrigger value="log">Care Log</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule">
            <CareSchedule plant={plant} />
          </TabsContent>
          <TabsContent value="log">
            <CareLog plant={plant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PlantDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <Skeleton className="aspect-square w-full rounded-t-lg" />
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
