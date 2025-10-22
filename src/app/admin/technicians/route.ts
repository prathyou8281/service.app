import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  const db = getDB();
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, skill, experience FROM technicians ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (e:any) {
    return NextResponse.json({ success:false, message:e.message }, { status:500 });
  }
}

export async function PUT(req: Request) {
  const db = getDB();
  try {
    const body = await req.json(); // { id, name?, email?, phone?, skill?, experience? }
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success:false, message:"Missing id" }, { status:400 });

    const fields = Object.keys(updates);
    if (!fields.length) return NextResponse.json({ success:true });

    const setSql = fields.map(f => `${f} = ?`).join(", ");
    const params = fields.map(f => (updates as any)[f]);
    params.push(id);

    await db.query(`UPDATE technicians SET ${setSql} WHERE id = ?`, params);
    return NextResponse.json({ success: true });
  } catch (e:any) {
    return NextResponse.json({ success:false, message:e.message }, { status:500 });
  }
}
