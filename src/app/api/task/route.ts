import { Task } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '~/libs/prisma';

export async function GET(request: NextRequest, context: any) {
  const username = request.nextUrl.searchParams.get('username')?.toString();

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { Task: true }
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found.' });
  }

  const tasksFounded = user.Task;

  return NextResponse.json({ data: tasksFounded });
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const username = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (!username) {
      throw new Error('User not found.');
    }

    const newTask = await prisma.task.create({
      data: {
        body: data.body,
        title: data.title,
        userId: username?.id,
        important: data.important
      }
    });
    return NextResponse.json({ newTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  const data: Task = await request.json();

  try {
    const newTask = await prisma.task.update({
      data,
      where: {
        id: data.id
      }
    });

    return NextResponse.json({ ...newTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
