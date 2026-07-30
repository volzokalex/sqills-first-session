// Static data for the First Session prototype (v2 — matches the flow schema draft 01).
// No emojis anywhere; icons come from the DS icon set (see icons.js).

export const PROFESSIONS = [
  { id: 'marketer',   label: 'Marketer',            noun: 'marketing consultant', topic: 'a boutique marketing studio' },
  { id: 'consultant', label: 'Consultant',          noun: 'independent consultant', topic: 'an independent consulting practice' },
  { id: 'teacher',    label: 'Teacher',             noun: 'private tutor',         topic: 'a private tutoring service' },
  { id: 'owner',      label: 'Small-business owner', noun: 'small-business owner',  topic: 'a neighbourhood coffee bar' },
  { id: 'freelancer', label: 'Freelancer (design)', noun: 'freelance designer',    topic: 'a freelance design studio' },
  { id: 'manager',    label: 'Manager',             noun: 'operations manager',    topic: 'a project management service' },
];

export const DEFAULT_ONBOARDING = { profession: 'marketer', goal: 'Earn €1,000 on the side', name: 'Alex' };

// C3 — single-select. Each option = one prompt + one render template (schema_id).
export const SITE_TYPES = [
  { id: 'profile', icon: 'user',          label: 'A profile page',         desc: 'Show who you are and what you do' },
  { id: 'service', icon: 'map-pin-house', label: 'A local service page',    desc: 'Bring in nearby customers' },
  { id: 'launch',  icon: 'sparkles',      label: 'An offer or launch page', desc: 'Announce something and drive action' },
];

// 16 steps.
export const STEPS = [
  { id: 'A1', kind: 'welcome' }, { id: 'A2', kind: 'welcome' }, { id: 'A3', kind: 'welcome' },
  { id: 'B1', kind: 'video' }, { id: 'B2', kind: 'video' }, { id: 'B3', kind: 'video' },
  { id: 'B4', kind: 'tools' }, { id: 'B5', kind: 'gate' },
  { id: 'C1', kind: 'lesson' }, { id: 'C3', kind: 'lesson' }, { id: 'C4', kind: 'lesson' },
  { id: 'C5', kind: 'lesson' }, { id: 'C6', kind: 'lesson' }, { id: 'C7', kind: 'artifact' }, { id: 'C8', kind: 'lesson' },
];

// AI tool logos for B4 (provided by Alex). Arranged 3 on top, 2 below.
export const LOGOS = [
  { src: 'assets/logos/ChatGPT-Logo.svg.webp', alt: 'ChatGPT' },
  { src: 'assets/logos/Claude.png', alt: 'Claude' },
  { src: 'assets/logos/rectangle-gemini-google-icon-symbol-logo-free-png.webp', alt: 'Gemini' },
  { src: 'assets/logos/Runway-Ai-Black-Symbol-Logo-PNG.jpg', alt: 'Runway' },
  { src: 'assets/logos/claude-icon-logo.png', alt: 'Claude' },
];

export const LESSON_STEP_IDS = ['C1', 'C3', 'C4', 'C5', 'C6', 'C8'];

export const COPY = {
  A1: { text: 'Before we dive in\nlet’s show you around.' },
  A2: {
    title: 'Welcome to your Sqills AI Program',
    body: "You'll finish with real skills, real work you've made, the confidence to use any AI tool, and the AI Mastery Certification.",
  },
  A3: {
    eyebrow: 'How it works',
    title: "What's inside the program",
    body: 'The four words you’ll see. You only need this once.',
    chain: [
      { icon: 'compass',        name: 'Missions',  desc: 'Pick a mission on the map and learn a skill' },
      { icon: 'graduation-cap', name: 'Lessons',   desc: '3–15 min of practice and theory, step by step' },
      { icon: 'layers',         name: 'Use cases', desc: 'Practical tasks for real-world cases' },
      { icon: 'file-text',      name: 'Artifacts', desc: 'A result you can actually touch' },
    ],
    cta: 'Show me how it works',
  },
  B1: {
    eyebrow: 'The map', title: 'How the Mission Map works',
    body: 'The Mission Map is your path to becoming an AI-powered person. We recommend going in order, building up complexity as you go — but you can pick whichever mission interests you most. No limits: learn whatever’s most exciting today.',
    video: 'assets/videos/home_3x4.mp4', cta: 'Continue',
  },
  B2: {
    eyebrow: 'A mission', title: "What's inside a mission?",
    body: 'It’s simple — a set of lessons. Take them one by one, 3–15 minutes each: practice and theory. Finish all the lessons and you’ve learned a new skill. Every lesson is guided step by step, and you can always go back and repeat any block — or the whole lesson.',
    video: 'assets/videos/lesson_3x4.mp4', cta: 'Continue',
  },
  B3: {
    eyebrow: 'Use cases', title: 'What use cases are',
    body: 'Oh, our favourite. Use cases are practical tasks from real-world cases that our team and many learners solve every day. Pick whatever speaks to you and get a real result right away.',
    video: 'assets/videos/Explore_3x4.mp4', cta: 'Continue',
  },
  B4: {
    eyebrow: 'P.S.', title: 'Oh — one more thing.',
    body: 'Once you’re on this path, you can work with any AI tool. Just keep trying — we’ll teach you the skills.',
    caption: '…and every new one that comes next.',
    cta: 'Continue',
  },
  B5: {
    eyebrow: 'Ready?', title: 'Start the lesson.',
    body: 'No theory first. In a few minutes you’ll have made something real — and you’ll see exactly how simple it is.',
    cta: 'Begin',
  },
  C1: {
    eyebrow: 'Lesson 0', title: "Let's make your first product",
    body: 'Today that product is a landing page — a real, one-page website. The goal isn’t to load you with theory; we just want to show how fast and simple a real result can be.',
    sub: 'No coding, no technical background, only your ideas.',
    vcaption: 'Here’s one we made earlier — yours is next.',
    video: 'assets/videos/site_3x4.mp4', cta: "Let's build it",
  },
  C3: {
    eyebrow: 'Quick guess', title: 'Before we build it — a quick guess',
    body: 'If you hired someone to build a one-page website, how long would it take?',
    options: ['A few days', 'About a week', 'A few weeks'],
    cta: 'Continue',
  },
  C4: {
    eyebrow: 'Prompting', title: "Let's do it much faster.",
    body: 'We’ve already tuned it to produce a strong result. As you’ve probably noticed, the prompt isn’t long or complex — and that’s the beauty of it. Even a format this simple can produce a thoughtful, well-built one-page site in under five minutes — a real starting point for your own project.',
    note: 'Locked for your first build',
    cta: 'Generate my page',
  },
  C5: {
    statuses: ['Reading your prompt', 'Writing your headline', 'Designing the sections', 'Laying out the page', 'Polishing the details'],
    sub: 'This usually takes a few seconds.',
  },
  C6: {
    headline: 'Congrats — you did it.',
    say1: 'Follow the link and see your result!',
    say2: 'Next, in Use Cases, you’ll build your own unique product — and adapt it to your needs: tweak the prompt, add your own ideas, and experiment.',
    open: 'View your site',
    cta: 'Complete lesson!',
  },
  C8: {
    term: '> LESSON COMPLETE',
    capability: 'You can now turn a single prompt into a finished, designed web page — no code, no designer.',
    ratingQ: 'How was it?',
    feedbackLabel: 'What could be better?',
    cta: 'Continue',
  },
};
