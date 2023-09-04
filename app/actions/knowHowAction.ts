'use server'
import { revalidatePath } from "next/cache"
import { createKnowHow, updateKnowHow } from "../services/knowHowService";
import { } from "../services/tagService";
import { KnowHow, User } from "@prisma/client";

export async function createKnowHowAction(data: FormData) {
  await createKnowHow(data);
  revalidatePath('/')
}

