const prompts = [
  "What's one thing that's been weighing on your mind lately?",
  "How are you feeling right now?",
  "What's something that made you smile recently?",
  "What does a good day look like to you?",
  "Is there something specific you'd like to talk about?",
  "What's been your biggest challenge this week?",
  "How do you usually cope when things get tough?",
  "What's something you're looking forward to?",
  "Tell me about a moment when you felt heard.",
  "What would help you feel better right now?",
];

export function getRandomIcebreaker() {
  const text = prompts[Math.floor(Math.random() * prompts.length)];
  return { id: Date.now().toString(), text };
}
