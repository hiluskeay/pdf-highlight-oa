// app/api/pdf/update/route.ts

import pdfStorage from "../../../utils/pdfStorage";
import { storageMethod } from "../../../utils/env";
import {
  deletePdf as supabaseDeletePdf,
  savePdf as supabaseSavePdf,
} from "../../../utils/supabase";
import { StorageMethod } from "../../../utils/types";

async function handleRequest(
  req: Request,
  action: (body: any, db?: pdfStorage) => Promise<void>
): Promise<Response> {
  let db: pdfStorage | undefined;
  try {
    const body = await req.json();
    if (storageMethod === StorageMethod.sqlite) {
      db = new pdfStorage();
    }
    await action(body, db);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  } finally {
    if (db) {
      await db.close();
    }
  }
}

async function savePdf(body: any, db?: pdfStorage): Promise<void> {
  if (db) {
    await db.savePdf(body.pdfId, body.pdfData);
  } else {
    await supabaseSavePdf(body);
  }
}

async function removePdf(body: any, db?: pdfStorage): Promise<void> {
  if (db) {
    await db.deletePdf(body.pdfId);
  } else {
    await supabaseDeletePdf(body);
  }
}

export async function POST(req: Request): Promise<Response> {
  return handleRequest(req, savePdf);
}

export async function DELETE(req: Request): Promise<Response> {
  return handleRequest(req, removePdf);
}
