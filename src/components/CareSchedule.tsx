'use client';

import { useState } from 'react';
import type { Plant, CareTask } from '@/lib/types';
import { usePlants } from '@/hooks/usePlants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplets, Leaf, Scissors, PlusCircle, CheckCircle2 } from 'lucide-react';
import { cn, isTaskDue } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CareScheduleProps {
  plant: Plant;
}

const taskIcons: { [key: string]: React.ElementType } = {
  Water: Droplets,
  Fertilize: Leaf,
  Prune: Scissors,
};

const taskSchema = z.object({
  type: z.string().min(1, 'Task type is required'),
  frequencyDays: z.coerce.number().min(1, 'Frequency must be at least 1 day'),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function CareSchedule({ plant }: CareScheduleProps) {
  const { addCareTask, completeCareTask } = usePlants();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { type: '', frequencyDays: 7 },
  });

  const onSubmit = (data: TaskFormValues) => {
    addCareTask(plant.id, data);
    toast({ title: 'Task Added', description: `${data.type} task has been added to the schedule.` });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleCompleteTask = (taskId: string) => {
    completeCareTask(plant.id, taskId);
    toast({ title: 'Task Completed!', description: `Great job! The task has been added to the care log.` });
  };

  const sortedSchedule = [...plant.schedule].sort((a, b) => {
    const aDueDate = new Date(new Date(a.lastCompleted).getTime() + a.frequencyDays * 24 * 60 * 60 * 1000);
    const bDueDate = new Date(new Date(b.lastCompleted).getTime() + b.frequencyDays * 24 * 60 * 60 * 1000);
    return aDueDate.getTime() - bDueDate.getTime();
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Care Schedule</CardTitle>
          <CardDescription>Upcoming tasks for your plant.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Care Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a task type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Water">Water</SelectItem>
                          <SelectItem value="Fertilize">Fertilize</SelectItem>
                          <SelectItem value="Prune">Prune</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequencyDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency (in days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSchedule.length > 0 ? (
            sortedSchedule.map((task) => {
              const Icon = taskIcons[task.type] || Leaf;
              const due = isTaskDue(task);
              const dueDate = new Date(new Date(task.lastCompleted).getTime() + task.frequencyDays * 24 * 60 * 60 * 1000);
              
              return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border',
                   due ? 'bg-amber-100/60 dark:bg-amber-900/20 border-amber-500/50' : 'bg-card'
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("h-6 w-6", due ? "text-amber-600 dark:text-amber-400" : "text-primary")} />
                  <div>
                    <p className="font-semibold">{task.type}</p>
                    <p className="text-sm text-muted-foreground">
                        {due ? 'Due now' : `Due in ${Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24))} days`}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => handleCompleteTask(task.id)}>
                    <CheckCircle2 className="h-4 w-4"/>
                    Done
                </Button>
              </div>
            )})
          ) : (
            <p className="text-muted-foreground text-center py-8">No care tasks scheduled yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
