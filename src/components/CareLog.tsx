import type { Plant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Image from 'next/image';

interface CareLogProps {
  plant: Plant;
}

export default function CareLog({ plant }: CareLogProps) {
    const sortedLog = [...plant.log].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Log</CardTitle>
        <CardDescription>A history of care activities for this plant.</CardDescription>
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
                  <TableCell>{new Date(entry.date).toLocaleTimeString()}</TableCell>
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
