import {
  MindCard,
  MindCardContent,
  MindCardDescription,
  MindCardHeader,
  MindCardTitle,
} from "@/components/mind/MindCard";
import { MindButton } from "@/components/mind/MindButton";
import { MindInput } from "@/components/mind/MindInput";

export function App() { // main app component, used for displaying the main content of the page, we are using the mind card, mind button and mind input components to display the content of the page, we are also using the grid layout to display the content in a responsive way
  return (
    <main className="min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <section className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[1.1fr_480px]">
        <div className="space-y-6"> // we are using the space-y-6 class to add space between the elements in the div, we are also using the lg:grid-cols-[1.1fr_480px] class to create a grid layout with two columns, the first column will take 1.1fr of the available space and the second column will take 480px of the available space, this will allow us to display the content in a responsive way
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              MindGPS
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              A calm digital space to map thoughts, emotions, and reflection.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"> // we are using the max-w-xl class to limit the width of the paragraph, we are also using the text-sm class to make the text smaller and the leading-relaxed class to increase
              Build emotional maps, capture notes, and explore patterns in a
              workspace designed to feel clear, soft, and intentional.
            </p>
          </div>

          <div className="flex flex-wrap gap-3"> // we are using the flex-wrap class to allow the buttons to wrap to the next line on smaller screens, we are also using the gap-3 class to add space between the buttons
            <MindButton>Get Started</MindButton>
            <MindButton variant="secondary">Preview Workspace</MindButton>
          </div>

          <div className="grid gap-4 pt-4 md:grid-cols-3">
            <MindCard className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Maps
              </p>
              <p className="mt-2 text-sm text-foreground">
                Visually connect emotions, thoughts, and triggers.
              </p>
            </MindCard>

            <MindCard className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Notes
              </p>
              <p className="mt-2 text-sm text-foreground">
                Journal reflections and link entries to your mental map.
              </p>
            </MindCard>

            <MindCard className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Insights
              </p>
              <p className="mt-2 text-sm text-foreground">
                Surface patterns and trends from your emotional data.
              </p>
            </MindCard>
          </div>
        </div>

        <MindCard className="w-full max-w-md justify-self-center lg:justify-self-end">
          <MindCardHeader> // we are using the mind card header component to display the title and description of the card, we are also using the mind card title and mind card description components to display the title and description of the card respectively
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Welcome Back
            </p>
            <MindCardTitle>Sign in to MindGPS</MindCardTitle>
            <MindCardDescription>
              Continue your reflection journey with your maps, notes, and
              insights.
            </MindCardDescription>
          </MindCardHeader>

          <MindCardContent>
            <div className="space-y-3">
              <MindInput type="email" placeholder="Email address" />
              <MindInput type="password" placeholder="Password" />
            </div>

            <div className="pt-2">
              <MindButton fullWidth>Sign In</MindButton>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button className="font-medium text-primary hover:underline">
                Create one
              </button>
            </p>
          </MindCardContent>
        </MindCard>
      </section>
    </main>
  );
}

export default App;