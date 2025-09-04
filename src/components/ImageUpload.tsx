import React, { useCallback, useState } from 'react';
import { Upload, Camera, Loader2, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionData {
  food: FoodItem[];
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface ImageUploadProps {
  onAnalysisComplete: (data: NutritionData) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onAnalysisComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeImage = async (file: File) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('https://akashgaragad.app.n8n.cloud/webhook-test/meal-AI', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const result = await response.json();
      const nutritionData = Array.isArray(result) ? result[0]?.output : result.output;
      
      if (nutritionData && nutritionData.status === 'success') {
        setIsUploading(false);
        onAnalysisComplete(nutritionData);
        
        toast({
          title: "Analysis Complete!",
          description: `Found ${nutritionData.food.length} food items in your meal.`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsUploading(false);
      
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze the image
    analyzeImage(file);
  }, [toast, onAnalysisComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {previewImage && (
        <Card className="overflow-hidden shadow-card">
          <img 
            src={previewImage} 
            alt="Uploaded meal" 
            className="w-full h-48 object-cover"
          />
        </Card>
      )}
      
      <Card 
        className="p-6 shadow-card bg-gradient-card transition-smooth"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-center">
              Analyzing your meal...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <FileImage className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Meal</h3>
              <p className="text-muted-foreground text-sm">
                Drop an image here or choose from your device
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="link" 
                className="flex-1"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleCameraCapture}
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}
      </Card>
    </div>
  );
};