import { createGeminiPlanningDraft } from '../ai/planning/geminiPlanner';
import { createTemplatePlanningDraft } from '../ai/planning/templatePlanner';

const planners = {
  gemini: createGeminiPlanningDraft,
  template: createTemplatePlanningDraft,
};

export async function generatePlanning(project, options = {}) {
  const provider = options.provider || import.meta.env.VITE_PLANNING_PROVIDER || 'gemini';
  const planner = planners[provider];

  if (!planner) {
    throw new Error(`Unsupported planning provider: ${provider}`);
  }

  return planner(project, options);
}
