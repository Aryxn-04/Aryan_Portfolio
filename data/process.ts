export const processContent = { label: "My editing process" } as const;
export const processSteps = [
  { name: "Brief", description: "Goals, references and scope." },
  { name: "Edit", description: "Cuts, pacing and visual structure." },
  { name: "Revise", description: "Feedback, polish and final tweaks." },
  { name: "Deliver", description: "Export, handoff and publish-ready files." },
] as const;
