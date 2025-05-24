# Інструкції для генерації коду в проекті MeetHub

## Загальні принципи

- Використовуй TypeScript для всього коду з суворою типізацією
- Дотримуйся React функціонального підходу з хуками
- Слідуй архітектурі Next.js з App Router
- Організовуй код за принципами атомарного дизайну для компонентів

## Технічний стек

- Next.js для фронтенд та API
- React + TypeScript
- Prisma ORM для роботи з базою даних PostgreSQL
- Shadcn/UI для компонентів інтерфейсу
- React Hook Form для форм
- Zod для валідації
- Auth.js (NextAuth) для автентифікації
- Stripe для платежів
- Sentry для логування помилок

## Структура проекту

- `/src/app` - роути та сторінки Next.js
- `/src/components` - React компоненти
- `/src/actions` - серверні дії (Server Actions)
- `/src/core` - основна конфігурація
- `/src/hooks` - кастомні React-хуки
- `/src/lib` - допоміжні функції та константи
- `/src/types` - TypeScript типи
- `/src/utils` - утилітарні функції
- `/prisma` - схема бази даних і міграції

## Правила генерації коду

### Для компонентів

```tsx
// компоненти завжди як функціональні React-компоненти з TypeScript
import { FC } from "react";

import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button onClick={onClick}>Дія</Button>
    </div>
  );
};
```

### Для серверних дій (Server Actions)

```tsx
"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/core/auth";
import { prisma } from "@/core/prisma";

export async function createItem(data: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = data.get("name") as string;

  const item = await prisma.item.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  revalidatePath("/items");

  return item;
}
```

### Для API роутів (App Router)

```tsx
// app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/core/auth";
import { prisma } from "@/core/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.item.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(items);
}
```

### Стилізація

- Використовуй Tailwind CSS для всіх стилів
- Дотримуйся атомарного підходу з класами
- Для складних компонентів використовуй Shadcn/UI

### Обробка помилок

- Завжди використовуй try/catch для асинхронних операцій
- Логуй критичні помилки в Sentry
- Показуй користувачу зрозумілі повідомлення про помилки

### Валідація

- Для всіх форм використовуй Zod-схеми
- Підключай схеми через react-hook-form і hookform/resolvers

## Приклад бізнес-логіки для подій (Events)

```tsx
// Створення події
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/core/auth";
import { prisma } from "@/core/prisma";
import { eventSchema } from "@/lib/schemas";

// Створення події

export async function createEvent(data: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Витягуємо та валідуємо дані
  const validatedData = eventSchema.parse({
    title: data.get("title"),
    description: data.get("description"),
    date: new Date(data.get("date") as string),
    location: data.get("location"),
    categoryId: data.get("categoryId"),
  });

  // Створюємо запис в БД
  const event = await prisma.event.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}
```

## Додаткові рекомендації

1. Завжди перевіряй автентифікацію користувача перед виконанням дій
2. Використовуй строгу типізацію для всіх функцій і компонентів
3. Оптимізуй запити до бази даних через правильні Prisma-запити
4. Використовуй кешування та ревалідацію даних Next.js
5. Дотримуйся принципів доступності (a11y) у компонентах
6. Документуй складні функції та логіку
