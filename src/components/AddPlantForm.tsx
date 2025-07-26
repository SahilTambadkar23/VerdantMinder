'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePlants } from '@/hooks/usePlants';
import { useToast } from '@/hooks/use-toast';
import { handleSuggestCareSchedule } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  plantName: z.string().min(2, { message: 'Plant name must be at least 2 characters.' }),
  plantType: z.string().min(2, { message: 'Plant type must be at least 2 characters.' }),
  plantDescription: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  plantPhoto: z.any().refine((file) => file, 'Plant photo is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddPlantForm() {
  const router = useRouter();
  const { addPlant } = usePlants();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ schedule: string; resources: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantName: '',
      plantType: '',
      plantDescription: '',
      plantPhoto: null,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoDataUri(reader.result as string);
        form.setValue('plantPhoto', file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onGetSuggestion = async () => {
    await form.trigger(['plantName', 'plantType', 'plantDescription']);
    const { plantName, plantType, plantDescription } = form.getValues();
    
    if (!plantName || !plantType || !plantDescription || !photoDataUri) {
      toast({
        title: "Missing Information",
        description: "Please provide a name, type, description, and photo to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAiLoading(true);
    try {
      const result = await handleSuggestCareSchedule({
        plantName,
        plantType,
        plantDescription,
        plantPhotoDataUri: photoDataUri,
      });
      setAiSuggestion({ schedule: result.careSchedule, resources: result.additionalResources });
    } catch (error) {
      toast({
        title: "AI Suggestion Failed",
        description: "Could not get suggestions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const newPlant = addPlant({
      name: data.plantName,
      type: data.plantType,
      description: data.plantDescription,
      imageUrl: photoPreview || 'https://placehold.co/600x600.png',
    });
    toast({
      title: 'Plant Added!',
      description: `${data.plantName} has been added to your collection.`,
    });
    router.push(`/plants/${newPlant.id}`);
  };

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Plant Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                   <FormField
                    control={form.control}
                    name="plantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Monstera Deliciosa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plantType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tropical" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="plantPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handlePhotoChange} className="pt-2" />
                      </FormControl>
                      {photoPreview && (
                        <div className="mt-4 aspect-square relative w-full rounded-md overflow-hidden border">
                          <Image src={photoPreview} alt="Plant preview" fill className="object-cover" />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="plantDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your plant's condition, size, or any other relevant details." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button type="button" variant="outline" onClick={onGetSuggestion} disabled={isAiLoading}>
                {isAiLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Get AI Care Suggestions
              </Button>
              <Button type="submit">Add Plant</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <Dialog open={!!aiSuggestion} onOpenChange={() => setAiSuggestion(null)}>
        <DialogContent className="max-w-md md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-primary"/> AI Care Suggestions
            </DialogTitle>
            <DialogDescription>
              Here's a suggested care schedule based on your plant's information. Use this as a starting point.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
            <h3 className="font-bold text-lg mb-2 font-headline">Suggested Schedule</h3>
            <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap font-body text-sm">
              {aiSuggestion?.schedule}
            </pre>
            <h3 className="font-bold text-lg mt-4 mb-2 font-headline">Additional Resources</h3>
            <div
              className="prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: aiSuggestion?.resources || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
