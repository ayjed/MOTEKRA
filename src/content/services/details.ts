export interface ServiceDetailCopy {
  focus: string;
  intent: string;
  overview: string;
  deliverables: readonly string[];
  approach: readonly (readonly [string, string])[];
  questions: readonly (readonly [string, string])[];
  control: string;
  outcome: string;
}

// Authored editorial proposals, not evidence of an active commercial offering.
export const serviceDetails: Readonly<Record<string, ServiceDetailCopy>> = {
  "ui-ux-design": {
    focus: "A clearer path through the product.",
    intent: "Product flows, interactive prototypes and interface systems.",
    overview: "A useful interface connects the task someone wants to complete with a clear path through the product. This proposed scope brings structure, interaction and visual language together, from early wireframes to a prototype that can be reviewed before implementation.",
    deliverables: ["Task flows and an agreed screen inventory", "Wireframes for the selected journeys", "An interactive prototype with key states", "Interface components and handoff notes"],
    approach: [["Understand the task", "Review the product context, intended users, existing evidence and constraints. Identify what needs validation rather than assuming the answer."], ["Shape the flow", "Map the important journeys and content hierarchy. Explore alternative layouts before committing to detailed screens."], ["Make it testable", "Connect the selected states into a prototype, review feedback and document decisions for implementation. Research and testing depth would be agreed in scope."]],
    questions: [["Is user research included?", "Research depth is a scope decision. Existing research, stakeholder input, interviews or usability sessions can inform the work, but no research activity is promised without agreement."], ["Can this build on an existing design system?", "An existing system can be the starting point. Component reuse, missing states, accessibility requirements and handoff expectations should be reviewed before proposing new patterns."], ["Does a prototype mean the product is built?", "No. A prototype communicates intended behavior. Production implementation, integrations and testing need their own agreed scope."]],
    control: "Transform the interface", outcome: "Wireframe → composed interface. This is a website concept demonstration, not client work.",
  },
  "web-development": {
    focus: "Content, behavior and implementation.",
    intent: "Responsive websites and considered web applications.",
    overview: "A web product needs more than a convincing first screen. This proposed scope considers content structure, navigation, interaction states and implementation together, with accessibility and search visibility treated as part of the interface rather than a separate visual layer.",
    deliverables: ["An agreed route and content structure", "Responsive page and component implementation", "Defined loading, empty and error states", "Testing notes and deployment handover for the agreed environment"],
    approach: [["Define the behavior", "Identify the routes, content, forms and integrations. Separate what can be rendered as content from what genuinely needs client-side interaction."], ["Build the experience", "Implement the agreed layouts and states for relevant screen sizes. Choose the technical approach around the product and hosting requirements."], ["Review in context", "Check keyboard use, responsive behavior and production HTML. Performance, integration testing and deployment responsibilities need explicit acceptance criteria."]],
    questions: [["Which framework would be used?", "The framework should follow the requirements, existing systems and deployment constraints. The technology used for this MOTEKRA website is not a promise that every engagement uses the same stack."], ["Are SEO results guaranteed?", "No ranking or traffic result is guaranteed. Crawlable content, descriptive metadata and sound page structure can be part of an agreed implementation; search outcomes depend on more than the website."], ["Does the scope include hosting?", "Hosting, domain ownership, ongoing maintenance and any third-party costs must be agreed separately. No paid platform is selected by this service preview."]],
    control: "Reframe the app windows", outcome: "Wide application → compact workspace. Responsive composition is demonstrated without a production integration.",
  },
  "mobile-app-development": {
    focus: "An experience that fits the journey.",
    intent: "Mobile journeys, prototypes and an agreed implementation path.",
    overview: "A mobile experience should make sense in a person’s hand: a clear next action, readable content and useful feedback. This proposed scope starts with the journey and platform constraints, then distinguishes a prototype from the engineering and release work needed for a working application.",
    deliverables: ["A mobile journey and key-state specification", "An interactive screen-flow prototype", "An agreed platform and integration plan", "Implementation and release checklist for the scoped build"],
    approach: [["Map the journey", "Identify the tasks, device context and permissions that matter. Agree which states need to work offline or handle interrupted connections."], ["Try the interaction", "Connect screens and review the transitions, selection states and navigation. The prototype helps expose gaps before they become implementation decisions."], ["Plan the build", "Choose an implementation path around platform needs, existing systems and maintenance. Store submission, release accounts and backend work require separate confirmation."]],
    questions: [["Is this native or cross-platform development?", "That choice follows the requirements. Device APIs, platform expectations, budget and existing code should be reviewed before selecting an approach."], ["Is the scene on this page a working app?", "No. It is an interface-flow study built for this website. It demonstrates selection and detail states; it is not a deployed mobile product or a client result."], ["Is an app-store launch included?", "Release responsibilities, account access, privacy requirements and store review must be agreed. This preview makes no delivery-date or approval guarantee."]],
    control: "Explore the mobile flow", outcome: "Explore → detail. The prototype changes state; no booking, payment or backend operation takes place.",
  },
  "product-strategy": {
    focus: "Know what to decide next.",
    intent: "A clearer product brief, priorities and decision path.",
    overview: "An idea becomes more useful when its assumptions and tradeoffs are visible. This proposed scope creates a shared picture of the problem, the people involved and the decisions that shape a practical next step. A roadmap is a planning aid, not a promise of outcomes or dates.",
    deliverables: ["A concise problem and opportunity brief", "An assumption and risk register", "A prioritized scope with explicit tradeoffs", "A staged roadmap with decision checkpoints"],
    approach: [["Frame the question", "Gather the available evidence, stakeholders and constraints. Distinguish known needs from assumptions that still require investigation."], ["Choose what matters", "Compare options against the agreed goals and constraints. Record why a capability belongs in the first scope or can wait."], ["Plan the next decision", "Organize the work into reviewable stages. Identify dependencies and the evidence needed to proceed, without presenting estimates as guarantees."]],
    questions: [["Will this validate an idea?", "It can make assumptions and validation needs clearer. A strategy document alone does not prove demand, commercial viability or product-market fit."], ["Is the roadmap a fixed delivery schedule?", "No. Timing depends on the agreed scope, team, dependencies and evidence. The proposed roadmap uses decision checkpoints rather than invented dates."], ["Can strategy happen before design or development?", "Yes, as a proposed planning activity. The useful output is a shared brief and a reasoned next step; implementation is a separate scope decision."]],
    control: "Organize the roadmap", outcome: "Open questions → staged priorities. These are illustrative planning checkpoints, not a delivery commitment.",
  },
  "brand-visual-design": {
    focus: "Make the identity work as a system.",
    intent: "A coherent visual language across brand and product.",
    overview: "A product feels more coherent when its typography, colour and visual decisions work together. This proposed scope can explore a new visual direction or clarify how an existing identity should be applied. Brand ownership, approvals and source artwork remain essential inputs.",
    deliverables: ["A reviewed visual direction and reference rationale", "Typography and colour usage proposals", "A component or application composition study", "Usage and source-asset handoff notes"],
    approach: [["Start with the identity", "Review the approved mark, existing guidelines, audience and intended applications. Preserve established artwork rather than silently replacing it."], ["Compose the system", "Explore hierarchy, colour relationships and layout across representative product surfaces. Make the relationships visible, not just the individual assets."], ["Document the decisions", "Record the agreed usage, accessibility considerations and source files. Any new identity work or licensed assets need explicit approval."]],
    questions: [["Will an existing logo be replaced?", "Only if a separate identity redesign is explicitly agreed. This website demonstration preserves the supplied MOTEKRA mark and does not create a replacement logo."], ["Are fonts and imagery included?", "Required assets and their licenses need review. Paid fonts, photography or other licensed material are not silently included in the proposed service."], ["How does this connect to interface design?", "The visual system can inform typography, colour roles, components and product layouts. The boundary between brand work and interface delivery should be agreed in scope."]],
    control: "Compose the brand system", outcome: "Separate elements → one visual system. The original supplied MOTEKRA mark stays unchanged.",
  },
};
