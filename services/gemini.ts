
import { GoogleGenAI, Type, Schema } from "@google/genai";

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBusinessInsight = async (
  moduleName: string,
  data: any
): Promise<string> => {
  const ai = getAiInstance();
  if (!ai) return "API Key Configuration Missing. Please set process.env.API_KEY.";

  const prompt = `
    You are an expert agricultural business consultant for a Banana Producer in Tapachula, Chiapas.
    Analyze the following data from the ${moduleName} module and provide a concise, strategic recommendation (max 100 words).
    Focus on profitability and risk. 
    **IMPORTANT: Respond strictly in Spanish.**

    Data:
    ${JSON.stringify(data, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate analysis at this time.";
  }
};

export interface PredictionResponse {
  weeklyProductionForecast: number[];
  predictedPriceUSD: number;
  predictedDemandGrowth: number;
  predictedExchangeRate: number;
  pestRiskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  pestRiskAnalysis: string;
  generalAnalysis: string;
}

export const generatePredictions = async (): Promise<PredictionResponse | null> => {
  const ai = getAiInstance();
  if (!ai) return null;

  const prompt = `
    Act as an advanced agricultural AI forecasting system for a Banana Plantation in Tapachula, Chiapas, Mexico.
    
    Simulate the analysis of:
    1. Historical production data (assume seasonality of the region).
    2. Global market trends for bananas (Price & Demand).
    3. Financial markets (MXN/USD Exchange Rate).
    4. IoT Sensor Data: Assume you are reading sensors showing high humidity (85%) and warm temperatures (30°C), typical for fungal growth like Sigatoka.

    Provide a prediction for:
    - Weekly production for the next 4 weeks (in boxes).
    - Next week's International Price (USD).
    - Next week's Demand Growth (%).
    - Next week's Exchange Rate (MXN).
    - Pest Risk Level (BAJO, MEDIO, ALTO, CRÍTICO).
    - A short analysis of the pest risk based on the sensor data.
    - A general executive summary.

    **CRITICAL: All textual analysis (pestRiskAnalysis and generalAnalysis) MUST be written in SPANISH.**
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      weeklyProductionForecast: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: "Estimated production in boxes for the next 4 weeks"
      },
      predictedPriceUSD: { type: Type.NUMBER, description: "Predicted price per box in USD" },
      predictedDemandGrowth: { type: Type.NUMBER, description: "Predicted demand growth percentage (e.g. 2.5)" },
      predictedExchangeRate: { type: Type.NUMBER, description: "Predicted MXN/USD exchange rate" },
      pestRiskLevel: { 
        type: Type.STRING, 
        enum: ['BAJO', 'MEDIO', 'ALTO', 'CRÍTICO'],
        description: "Risk level based on sensor data"
      },
      pestRiskAnalysis: { type: Type.STRING, description: "Explanation of pest risk based on humidity/temp in SPANISH" },
      generalAnalysis: { type: Type.STRING, description: "Executive summary of the market and production outlook in SPANISH" }
    },
    required: ["weeklyProductionForecast", "predictedPriceUSD", "predictedDemandGrowth", "predictedExchangeRate", "pestRiskLevel", "pestRiskAnalysis", "generalAnalysis"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PredictionResponse;
    }
    return null;
  } catch (error) {
    console.error("Prediction Error:", error);
    return null;
  }
};
