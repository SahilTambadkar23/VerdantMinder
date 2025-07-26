import Link from 'next/link';
import Image from 'next/image';
import type { Plant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PlantCardProps {
  plant: Plant;
  onRemovePlant: (plantId: string, plantName: string) => void;
}

export default function PlantCard({ plant, onRemovePlant }: PlantCardProps) {

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="group relative">
      <Link href={`/plants/${plant.id}`} className="block">
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-square relative">
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={plant.name.toLowerCase().replace(' ', '-')}
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
       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleDeleteClick}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{plant.name}" and all of its data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemovePlant(plant.id, plant.name)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </div>
  );
}
