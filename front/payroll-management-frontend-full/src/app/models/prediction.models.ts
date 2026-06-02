export interface SalaryMassPrediction {
  id: string;
  month: number;
  year: number;
  predictedSalaryMass: number;
  evolutionRate: number;
  predictionDate: string;
  notes: string;
}
