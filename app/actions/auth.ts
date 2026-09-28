"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const workspaceName = formData.get("workspaceName") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const slug =
    workspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  // 1. Create Workspace
  const workspace = await db.workspace.create({
    data: {
      name: workspaceName,
      slug,
    },
  });

  // 2. Create User
  const user = await db.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  // 3. Create Workspace Membership
  await db.member.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "ADMIN",
    },
  });

  // 4. Set Session Cookie
  const cookieStore = await cookies();

  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  // 5. Redirect to Workspace Dashboard
  redirect(`/${workspace.slug}`);
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("session");

  redirect("/signup");
}