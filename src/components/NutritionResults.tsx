import React from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

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

interface NutritionResultsProps {
  data: NutritionData;
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({ data }) => {
  const total = data.total.protein + data.total.carbs + data.total.fat;
  
  const macros = [
    {
      name: 'Protein',
      value: data.total.protein,
      percentage: (data.total.protein / total) * 100,
      color: 'bg-primary',
      unit: 'g'
    },
    {
      name: 'Carbs',
      value: data.total.carbs,
      percentage: (data.total.carbs / total) * 100,
      color: 'bg-secondary',
      unit: 'g'
    },
    {
      name: 'Fat',
      value: data.total.fat,
      percentage: (data.total.fat / total) * 100,
      color: 'bg-accent',
      unit: 'g'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Hero Calories - Clear Focal Point */}
      <div className="text-center mb-12">
        <Card className="p-8 shadow-glow bg-gradient-primary text-primary-foreground">
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-90">Total Calories</h3>
            <div className="text-6xl font-bold tracking-tight">{data.total.calories}</div>
            <p className="text-primary-foreground/70 text-lg">kcal</p>
          </div>
        </Card>
      </div>

      {/* Grouped Macronutrients - Visual Hierarchy */}
      <div className="grid md:grid-cols-3 gap-6">
        {macros.map((macro) => (
          <Card key={macro.name} className="p-6 shadow-card bg-gradient-card text-center group hover:shadow-glow transition-all duration-300">
            <div className={`w-16 h-16 rounded-full ${macro.color} mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-white font-bold text-xl">{macro.value}</span>
            </div>
            <h4 className="text-xl font-semibold mb-1">{macro.name}</h4>
            <p className="text-muted-foreground text-sm mb-3">{macro.value}{macro.unit}</p>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${macro.color}`}
                style={{ width: `${macro.percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium">{macro.percentage.toFixed(0)}%</span>
          </Card>
        ))}
      </div>

      {/* Food Items Breakdown */}
      <Card className="p-6 shadow-card bg-gradient-card">
        <h3 className="text-xl font-semibold mb-6 text-center">Detected Food Items</h3>
        <div className="space-y-3">
          {data.food.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{item.calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  {item.protein}g P | {item.carbs}g C | {item.fat}g F
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Confidence removed as not in new response format */}
    </div>
  );
};