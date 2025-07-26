import AddPlantForm from '@/components/AddPlantForm';

export default function AddPlantPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Add a New Plant</h1>
      <div className="max-w-2xl mx-auto">
        <AddPlantForm />
      </div>
    </div>
  );
}
