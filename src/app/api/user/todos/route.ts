import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any, secret });

    if (!token?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const todoListsRaw = await prisma.todo_list.findMany({
      where: { user_id: token.sub as string },
      include: {
        category: { select: { id: true, name: true } },
        todo_list_task: {
          select: {
            id: true,
            description: true,
            is_completed: true,
            scheduled_date: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const todoLists = todoListsRaw.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      tasks: t.todo_list_task || [],
    }));

    return NextResponse.json({ todoLists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
