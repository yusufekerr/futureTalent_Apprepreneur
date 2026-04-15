import type { NextRequest } from "next/server";

type StudyGoal = {
  title: string;
  completed: boolean;
  date: string;
};

function utcDayStart(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function isWithinLastThreeCalendarDays(goalDateStr: string, now: Date): boolean {
  const goalDay = utcDayStart(new Date(goalDateStr));
  if (Number.isNaN(goalDay.getTime())) return false;

  const today = utcDayStart(now);
  const oldest = new Date(today);
  oldest.setUTCDate(oldest.getUTCDate() - 2);

  return goalDay >= oldest && goalDay <= today;
}

function adviceForGoals(goals: StudyGoal[]): string {
  const now = new Date();
  const recent = goals.filter((g) => isWithinLastThreeCalendarDays(g.date, now));

  if (recent.length === 0) {
    return "Son üç günde analiz edilecek hedef bulunamadı. Hedeflerin tarihini kontrol edin.";
  }

  const completed = recent.filter((g) => g.completed).length;
  const incomplete = recent.length - completed;

  if (completed > incomplete) {
    return "Son üç günde çoğu hedefini tamamladın; bu çok iyi bir performans. Bir üst seviyeye geçmek için hedeflerini biraz daha zorlayıcı seçebilirsin.";
  }

  if (incomplete > completed) {
    return "Son üç günde tamamlanmayan hedeflerin sayısı fazla. Daha az ve net hedefler koyarak sürdürülebilir bir tempo yakalamayı dene.";
  }

  return "Tamamlanan ve eksik kalan hedefler dengeli görünüyor. Bu ritmi koruyarak düzenli çalışmaya devam etmeye odaklan.";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON gövdesi." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("goals" in body)) {
    return Response.json(
      { error: "İstek gövdesinde 'goals' dizisi gerekli." },
      { status: 400 },
    );
  }

  const { goals } = body as { goals: unknown };
  if (!Array.isArray(goals)) {
    return Response.json({ error: "'goals' bir dizi olmalı." }, { status: 400 });
  }

  const parsed: StudyGoal[] = [];
  for (const item of goals) {
    if (!item || typeof item !== "object") {
      return Response.json({ error: "Her hedef bir nesne olmalı." }, { status: 400 });
    }
    const g = item as Record<string, unknown>;
    if (typeof g.title !== "string" || typeof g.completed !== "boolean") {
      return Response.json(
        { error: "Her hedef 'title' (string) ve 'completed' (boolean) içermeli." },
        { status: 400 },
      );
    }
    if (typeof g.date !== "string") {
      return Response.json({ error: "Her hedef 'date' (string) içermeli." }, { status: 400 });
    }
    parsed.push({ title: g.title, completed: g.completed, date: g.date });
  }

  const message = adviceForGoals(parsed);
  return Response.json({ message });
}
