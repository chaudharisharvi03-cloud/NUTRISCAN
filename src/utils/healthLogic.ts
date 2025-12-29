export const HEALTH_LIMITS = {
  CKD: { 
    sodium: 400, 
    potassium: 200 
  }, // mg per serving
  DIABETES: { 
    sugar: 10 
  } // grams per serving
};

export type ScanResult = {
  sodium: number;
  sugar: number;
  potassium: number;
};

export const evaluateSafety = (data: ScanResult) => {
  const issues: string[] = [];
  
  if (data.sodium > HEALTH_LIMITS.CKD.sodium) {
    issues.push("High Sodium (CKD Risk)");
  }
  
  if (data.potassium > HEALTH_LIMITS.CKD.potassium) {
    issues.push("High Potassium (CKD Risk)");
  }
  
  if (data.sugar > HEALTH_LIMITS.DIABETES.sugar) {
    issues.push("High Sugar (Diabetes Risk)");
  }
  
  return {
    isSafe: issues.length === 0,
    issues,
  };
};