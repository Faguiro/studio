import { DayPlanner } from "@/components/day-wise/DayPlanner";
import { ListTodo } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <ListTodo className="h-6 w-6" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-foreground">
              DiaAgil
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <DayPlanner />
      </main>
    </div>
  );
}
