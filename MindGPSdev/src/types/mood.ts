export type MoodEntry = { // this is the type for a mood entry, it will be used to store the mood entries in the state and pass them between components
  feeling: string;
  influences: string[];
  note: string;
  createdAt: string;
};
// (Andy) I am refactoring  the moodentry type to a separate file so that it can be imported and used in multiple components without having to import the entire HomePage component, this will help with code organization and reduce unnecessary imports.