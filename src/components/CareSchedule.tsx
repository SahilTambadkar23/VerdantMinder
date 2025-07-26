'use client';

import { useState, useRef, useEffect } from 'react';
import type { Plant, CareTask } from '@/lib/types';
import { usePlants } from '@/hooks/usePlants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplets, Leaf, Scissors, PlusCircle, CheckCircle2, Trash2, Camera } from 'lucide-react';
import { cn, isTaskDue } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

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

const completeTaskSchema = z.object({
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;
type CompleteTaskFormValues = z.infer<typeof completeTaskSchema>;

export default function CareSchedule({ plant }: CareScheduleProps) {
  const { addCareTask, completeCareTask, removeCareTask } = usePlants();
  const { toast } = useToast();

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isCompleteTaskDialogOpen, setIsCompleteTaskDialogOpen] = useState(false);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);

  const [taskToComplete, setTaskToComplete] = useState<CareTask | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const addTaskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { type: '', frequencyDays: 7 },
  });

  const completeTaskForm = useForm<CompleteTaskFormValues>({
    resolver: zodResolver(completeTaskSchema),
    defaultValues: { notes: '' },
  });
  
  useEffect(() => {
    if (isCameraDialogOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
  
      getCameraPermission();
    } else {
      // Stop camera stream when dialog is closed
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraDialogOpen, toast]);

  const onAddTaskSubmit = (data: TaskFormValues) => {
    addCareTask(plant.id, data);
    toast({ title: 'Task Added', description: `${data.type} task has been added to the schedule.` });
    setIsAddTaskDialogOpen(false);
    addTaskForm.reset();
  };
  
  const handleOpenCompleteDialog = (task: CareTask) => {
    setTaskToComplete(task);
    setCapturedPhoto(null);
    completeTaskForm.reset();
    setIsCompleteTaskDialogOpen(true);
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(dataUri);
      setIsCameraDialogOpen(false);
    }
  };

  const onCompleteTaskSubmit = (data: CompleteTaskFormValues) => {
    if (!taskToComplete) return;
    completeCareTask(plant.id, taskToComplete.id, data.notes, capturedPhoto);
    toast({ title: 'Task Completed!', description: `Great job! The task has been added to the care log.` });
    setIsCompleteTaskDialogOpen(false);
    setTaskToComplete(null);
    setCapturedPhoto(null);
  };
  
  const handleRemoveTask = (taskId: string) => {
    removeCareTask(plant.id, taskId);
    toast({ title: 'Task Removed', description: 'The task has been removed from the schedule.', variant: 'destructive' });
  };

  const sortedSchedule = [...plant.schedule].sort((a, b) => {
    const aDueDate = new Date(new Date(a.lastCompleted).getTime() + a.frequencyDays * 24 * 60 * 60 * 1000);
    const bDueDate = new Date(new Date(b.lastCompleted).getTime() + b.frequencyDays * 24 * 60 * 60 * 1000);
    return aDueDate.getTime() - bDueDate.getTime();
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Care Schedule</CardTitle>
            <CardDescription>Upcoming tasks for your plant.</CardDescription>
          </div>
          <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
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
              <Form {...addTaskForm}>
                <form onSubmit={addTaskForm.handleSubmit(onAddTaskSubmit)} className="space-y-4">
                  <FormField
                    control={addTaskForm.control}
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
                    control={addTaskForm.control}
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
                  <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenCompleteDialog(task)}>
                          <CheckCircle2 className="h-4 w-4"/>
                          Done
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive-outline">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the "{task.type}" task from your schedule. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveTask(task.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </div>
                </div>
              )})
            ) : (
              <p className="text-muted-foreground text-center py-8">No care tasks scheduled yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Complete Task Dialog */}
      <Dialog open={isCompleteTaskDialogOpen} onOpenChange={setIsCompleteTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task: {taskToComplete?.type}</DialogTitle>
          </DialogHeader>
          <Form {...completeTaskForm}>
            <form onSubmit={completeTaskForm.handleSubmit(onCompleteTaskSubmit)} className="space-y-4">
              <FormField
                control={completeTaskForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any notes about this task..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Photo (Optional)</FormLabel>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="gap-2" onClick={() => setIsCameraDialogOpen(true)}>
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                    {capturedPhoto && (
                      <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                         <Image src={capturedPhoto} alt="Captured photo" fill className="object-cover" />
                      </div>
                    )}
                  </div>
              </FormItem>

              <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit">Complete Task</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Camera Dialog */}
      <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
        <DialogContent className="max-w-md">
           <DialogHeader>
            <DialogTitle>Take a Photo</DialogTitle>
          </DialogHeader>
           <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-muted rounded-md overflow-hidden aspect-video relative">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            {hasCameraPermission === false && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                  Please enable camera access in your browser settings to use this feature.
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleTakePhoto} disabled={hasCameraPermission !== true} className="w-full">
              <Camera className="mr-2 h-4 w-4"/>
              Capture
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
