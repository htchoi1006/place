'use server';
import { revalidatePath } from "next/cache";
import { createKnowHow, createKnowHowWithDetailInfo, updateKnowHow } from "../services/knowHowService";
import { } from "../services/tagService";
import { KnowHow, User, KnowHowDetailInfo } from "@prisma/client";

export async function createKnowHowWithDetailAction(genData: FormData, knowhowDetailInfo: Omit<KnowHowDetailInfo, "id" | "knowHowId">) {
  // console.log('create KnowHow With detail information: ', JSON.stringify(knowhowDetailInfo, null, 2));
  await createKnowHowWithDetailInfo(genData, knowhowDetailInfo);
  revalidatePath('/')
}

export async function createKnowHowAction(data: FormData) {
  await createKnowHow(data);
  revalidatePath('/');
}
export async function updateKnowHowAction(data: KnowHow) {
  console.log('update KnowHow Action', JSON.stringify(data, null, 2));
  await updateKnowHow(data);
  revalidatePath('/');
}

