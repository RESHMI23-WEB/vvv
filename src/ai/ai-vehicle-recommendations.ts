'use server';

/**
 * @fileOverview An AI agent that recommends vehicles based on user preferences and viewing history.
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
  viewingHistory: z
    .string()
    .describe('The user viewing history of vehicles (e.g., brands, models, types).'),
});
export type VehicleRecommendationsInput = z.infer<typeof VehicleRecommendationsInputSchema>;

const VehicleRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommended vehicles based on the user preferences and viewing history.'),
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
  prompt: `You are a vehicle recommendation expert. Based on the user preferences and viewing history, provide a list of recommended vehicles.

User Preferences: {{{preferences}}}
Viewing History: {{{viewingHistory}}}

Recommendations:`,
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
