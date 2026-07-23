import { createTemplatePlanningDraft } from '../ai/planning/templatePlanner';

const planners = {
  template: createTemplatePlanningDraft,
};

export function generatePlanning(project, options = {}) {
  const provider = options.provider || 'template';
  const planner = planners[provider];

  if (!planner) {
    throw new Error(`Unsupported planning provider: ${provider}`);
  }

  return planner(project);
}
