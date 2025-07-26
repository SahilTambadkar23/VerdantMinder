import Link from 'next/link';
import Image from 'next/image';
import type { Plant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link href={`/plants/${plant.id}`} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="plant"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
            <CardTitle className="text-xl mb-1 truncate">{plant.name}</CardTitle>
            <CardDescription>
                <Badge variant="secondary">{plant.type}</Badge>
            </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
