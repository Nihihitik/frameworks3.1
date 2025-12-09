"use client";

import { useEffect, useState } from "react";

type AstroEvent = {
  id: string;
  name: string;
  type: string;
  date: string;
  details: string;
};

// Mock astronomy events data
const MOCK_EVENTS: Omit<AstroEvent, "id" | "date">[] = [
  { name: "Геминиды", type: "Метеорный поток", details: "До 150 метеоров/час, ZHR 120" },
  { name: "Персеиды", type: "Метеорный поток", details: "До 100 метеоров/час, радиант в Персее" },
  { name: "Леониды", type: "Метеорный поток", details: "До 15 метеоров/час, быстрые метеоры" },
  { name: "Квадрантиды", type: "Метеорный поток", details: "До 120 метеоров/час, короткий пик" },
  { name: "Ориониды", type: "Метеорный поток", details: "До 20 метеоров/час, связаны с кометой Галлея" },
  { name: "Полнолуние", type: "Фаза Луны", details: "Луна полностью освещена" },
  { name: "Новолуние", type: "Фаза Луны", details: "Идеально для наблюдения звёзд" },
  { name: "Первая четверть", type: "Фаза Луны", details: "Половина диска освещена" },
  { name: "Последняя четверть", type: "Фаза Луны", details: "Убывающая Луна" },
  { name: "Суперлуние", type: "Фаза Луны", details: "Луна в перигее, на 14% больше" },
  { name: "Юпитер в противостоянии", type: "Противостояние", details: "Лучшее время для наблюдения" },
  { name: "Сатурн в противостоянии", type: "Противостояние", details: "Кольца хорошо видны" },
  { name: "Марс в противостоянии", type: "Противостояние", details: "Ближайшее расстояние к Земле" },
  { name: "Венера — вечерняя звезда", type: "Видимость планет", details: "Макс. элонгация 47°" },
  { name: "Меркурий виден утром", type: "Видимость планет", details: "Западная элонгация 18°" },
  { name: "Соединение Луны и Юпитера", type: "Соединение", details: "Расстояние менее 2°" },
  { name: "Соединение Венеры и Марса", type: "Соединение", details: "Близкое сближение на небе" },
  { name: "Соединение Луны и Сатурна", type: "Соединение", details: "Красивое зрелище на рассвете" },
  { name: "Частное солнечное затмение", type: "Затмение", details: "Видно в северном полушарии" },
  { name: "Полное лунное затмение", type: "Затмение", details: "Кровавая луна" },
  { name: "Частное лунное затмение", type: "Затмение", details: "Земля частично затеняет Луну" },
  { name: "Комета C/2024 виз.", type: "Комета", details: "Звёздная величина 4.5" },
  { name: "Астероид сближается", type: "Астероид", details: "Безопасное расстояние 2 млн км" },
  { name: "МКС пролёт", type: "Спутник", details: "Яркость -3.5, высоко над горизонтом" },
  { name: "Starlink пролёт", type: "Спутник", details: "Цепочка спутников видна" },
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  "Метеорный поток": "text-yellow-400",
  "Фаза Луны": "text-blue-300",
  "Противостояние": "text-orange-400",
  "Видимость планет": "text-green-400",
  "Соединение": "text-purple-400",
  "Затмение": "text-red-400",
  "Комета": "text-cyan-400",
  "Астероид": "text-amber-500",
  "Спутник": "text-gray-400",
};

function generateRandomDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateEvents(): AstroEvent[] {
  const count = 8 + Math.floor(Math.random() * 5); // 8-12 events
  const shuffled = shuffleArray(MOCK_EVENTS);
  return shuffled.slice(0, count).map((event, index) => ({
    ...event,
    id: `event-${index}`,
    date: generateRandomDate(30),
  }));
}

export function AstroEventsTable() {
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate random events only on client to avoid hydration mismatch
  useEffect(() => {
    setEvents(generateEvents());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-muted-foreground animate-pulse">
          Загрузка событий...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Событие
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Тип
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Дата
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Детали
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{event.name}</td>
                <td className={`px-4 py-3 ${EVENT_TYPE_COLORS[event.type] ?? "text-muted-foreground"}`}>
                  {event.type}
                </td>
                <td className="px-4 py-3">{event.date}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {event.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Count */}
      <p className="text-xs text-muted-foreground">
        Показано {events.length} предстоящих событий
      </p>
    </div>
  );
}
