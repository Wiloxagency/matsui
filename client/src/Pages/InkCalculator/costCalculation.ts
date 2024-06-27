type Measurements = {
    unit: 'inch' | 'cm';
    height: number;
    width: number;
    inkCost: number;
    coverage: number;
  };
  
  type EstimatedResults = {
    meshCount: number;
    depositThickness: number; 
    unitPerGallon: number;    
    printsPerGallon: number;
    costPerShirt: number;
  };
  
  const convertToCm = (value: number, unit: 'inch' | 'cm'): number => {
    return unit === 'inch' ? value * 2.54 : value;
  };
  
  export function calculateResults  (measurements: Measurements, results: EstimatedResults[]): EstimatedResults[]  {
    const { unit, height, width, inkCost, coverage } = measurements;
    const heightCm = convertToCm(height, unit);
    const widthCm = convertToCm(width, unit);
    const areaCm2 = heightCm * widthCm * (coverage / 100);
  
    return results.map(result => {
      const depositThicknessCm = result.depositThickness * 0.00254; 
      const inkVolumePerPrintCm3 = areaCm2 * depositThicknessCm;
      const unitPerGallonCm2 = result.unitPerGallon * (unit === 'inch' ? 6.4516 : 1); // Convertir, si es necesario pulg a cm
      const printsPerGallon = 1000* (unitPerGallonCm2 / areaCm2);
      const costPerShirt = inkVolumePerPrintCm3 / 3785 * inkCost;
  
      return {
        ...result,
        printsPerGallon: parseFloat(printsPerGallon.toFixed(2)),
        costPerShirt: parseFloat(costPerShirt.toFixed(3))
      };
    });
  };
  
  // Yo probé estos valores en el site que te había pasado y funciona muy bien, ese site no incluye la variable coverage y asume que es un 100%,
  // Así que debes agregar esa variable en el frontend, como no se implementarlo en React te muestro por acá un ejemplo que probé en un editor
  // on-line typescript, todo lo que ves de acá en adelante lo quitas de esta parte porque debe ir en tu .tsx.

  const measurements: Measurements = {
    unit: 'inch',
    height: 30,
    width: 40,
    inkCost: 100,
    coverage: 100
  };
  
  const results: EstimatedResults[] = [
    { meshCount: 355, depositThickness: 1, unitPerGallon: 230.4, printsPerGallon: 0, costPerShirt: 0 },
    { meshCount: 200, depositThickness: 2, unitPerGallon: 115.2, printsPerGallon: 0, costPerShirt: 0 },
    { meshCount: 130, depositThickness: 3, unitPerGallon: 76.752, printsPerGallon: 0, costPerShirt: 0 },
    { meshCount: 110, depositThickness: 3.5, unitPerGallon: 61.176, printsPerGallon: 0, costPerShirt: 0 },
    { meshCount: 96, depositThickness: 4, unitPerGallon: 57.6, printsPerGallon: 0, costPerShirt: 0 },
    { meshCount: 60, depositThickness: 5, unitPerGallon: 46.08, printsPerGallon: 0, costPerShirt: 0 }
  ];
  
  const updatedResults = calculateResults(measurements, results);
  console.log(updatedResults);
  