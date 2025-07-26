import type { Plant } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

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
                <TableHead>Task</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{entry.taskType}</TableCell>
                  <TableCell>{entry.notes || '-'}</TableCell>
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
