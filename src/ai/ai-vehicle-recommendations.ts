'use server';

/**
 * @fileOverview An AI agent that recommends vehicles based on user preferences and available vehicles.
 *
 * - getVehicleRecommendations - A function that returns vehicle recommendations.
 * - VehicleRecommendationsInput - The input type for the getVehicleRecommendations function.
 * - VehicleRecommendationsOutput - The return type for the getVehicleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VehicleRecommendationsInputSchema = z.object({
  preferences: z
    .string()
    .describe('The user preferences for a vehicle (e.g., fuel efficiency, seating capacity, price range).'),
  availableVehicles: z
    .string()
    .describe('A comma-separated list of available vehicles in "Brand Model" format.'),
});
export type VehicleRecommendationsInput = z.infer<typeof VehicleRecommendationsInputSchema>;

const VehicleRecommendationsOutputSchema = z.object({
  recommendation: z.object({
    brand: z.string().describe('The brand of the recommended vehicle. Must be from the available vehicles list.'),
    model: z.string().describe('The model of the recommended vehicle. Must be from the available vehicles list.'),
    reason: z.string().describe("A short, one-sentence reason why this vehicle is recommended based on the user's preferences."),
  }),
});
export type VehicleRecommendationsOutput = z.infer<typeof VehicleRecommendationsOutputSchema>;

export async function getVehicleRecommendations(
  input: VehicleRecommendationsInput
): Promise<VehicleRecommendationsOutput> {
  return vehicleRecommendationsFlow(input);
}

const vehicleRecommendationsPrompt = ai.definePrompt({
  name: 'vehicleRecommendationsPrompt',
  input: {schema: VehicleRecommendationsInputSchema},
  output: {schema: VehicleRecommendationsOutputSchema},
  prompt: `You are a vehicle recommendation expert. Your task is to recommend one vehicle from the list of available vehicles that best matches the user's preferences.

You must only choose a vehicle from this list: {{{availableVehicles}}}

User Preferences: {{{preferences}}}

Analyze the preferences and select the best fit from the available vehicles. Provide the brand, model, and a brief reason for your choice.`,
});

const vehicleRecommendationsFlow = ai.defineFlow(
  {
    name: 'vehicleRecommendationsFlow',
    inputSchema: VehicleRecommendationsInputSchema,
    outputSchema: VehicleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await vehicleRecommendationsPrompt(input);
    return output!;
  }
);
