'use client';

import type { Plant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Image from 'next/image';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { usePlants } from '@/hooks/usePlants';
import { useToast } from '@/hooks/use-toast';
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

interface CareLogProps {
  plant: Plant;
}

export default function CareLog({ plant }: CareLogProps) {
  const { clearCareLog } = usePlants();
  const { toast } = useToast();
  const sortedLog = [...plant.log].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleClearLog = () => {
    clearCareLog(plant.id);
    toast({
      title: 'Care Log Cleared',
      description: `The care log for ${plant.name} has been cleared.`,
      variant: 'destructive'
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Care Log</CardTitle>
            <CardDescription>A history of care activities for this plant.</CardDescription>
        </div>
        {sortedLog.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive-outline" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear Log
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all care log entries for this plant. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearLog}>
                  Clear Log
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {sortedLog.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Photo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>{entry.taskType}</TableCell>
                  <TableCell>{entry.notes || '-'}</TableCell>
                  <TableCell>
                    {entry.photoUrl && (
                      <Image
                        src={entry.photoUrl}
                        alt={`Care log for ${plant.name}`}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint="plant"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-8">No care activities logged yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
