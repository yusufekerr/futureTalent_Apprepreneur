import { StudyTracker } from "./components/StudyTracker";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-zinc-100/90 via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <StudyTracker />
    </div>
  );
}
