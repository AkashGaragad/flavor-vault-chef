import React, { useState } from 'react';
import { Sparkles, Zap, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageUpload } from '../components/ImageUpload';
import { NutritionResults } from '../components/NutritionResults';
import heroImage from '../assets/hero-meal.jpg';

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

const CalAI = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const handleAnalysisComplete = (data: NutritionData) => {
    setNutritionData(data);
  };

  const resetApp = () => {
    setNutritionData(null);
    setShowUpload(false);
  };

  return (
    <div className=" bg-background">
         {!showUpload && !nutritionData && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center shadow-card bg-gradient-card">
                <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">1. Capture</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an image of your meal
                </p>
              </Card>
              
              <Card className="p-6 text-center shadow-card bg-gradient-card">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">2. Analyze</h3>
                <p className="text-muted-foreground">
                  AI identifies food items and calculates nutrition
                </p>
              </Card>
              
              <Card className="p-6 text-center shadow-card bg-gradient-card">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">3. Results</h3>
                <p className="text-muted-foreground">
                  Get instant macronutrient breakdown
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

     
      <section className="relative  px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
           
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Instant nutrition analysis from your meal photos. Get accurate macronutrient data in seconds.
            </p>
          </div>

          {!showUpload && !nutritionData && (
            <>
              <div className="mb-12">
                <img 
                  src={heroImage} 
                   width="600"
              height="400"
              loading="lazy"
                  alt="Healthy meal for nutrition analysis" 
                  className="w-full max-w-2xl mx-auto rounded-xl shadow-card"
                />
              </div>
              
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setShowUpload(true)}
                className="text-lg px-8 py-5 h-auto m-8"
              >
                <Camera className="h-6 w-6" />
                Analyze Your Meal
              </Button>
            </>
          )}
        </div>
      </section>


     
      {/* Upload Section */}
      {showUpload && !nutritionData && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button 
              variant="ghost" 
              onClick={resetApp}
              className="mb-8"
            >
              ← Back to Home
            </Button>
            
            <h2 className="text-3xl font-bold mb-8">
              Upload Your Meal Photo
            </h2>
            
            <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </section>
      )}

      {/* Results Section */}
      {nutritionData && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Button 
              variant="ghost" 
              onClick={resetApp}
              className="mb-8"
            >
              ← Analyze Another Meal
            </Button>
            
            <h2 className="text-3xl font-bold mb-8">
              Nutrition Analysis
            </h2>
            
            <NutritionResults data={nutritionData} />
          </div>
        </section>
      )}


    </div>
  );
};

export default CalAI;