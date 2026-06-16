import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Max file size is 8 MB" }, { status: 400 });
  }

  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const name = `${Date.now()}-${clean}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, name), bytes);

  return NextResponse.json({ path: `/uploads/${name}` });
}
