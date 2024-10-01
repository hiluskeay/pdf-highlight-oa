// app/api/pdf/get/route.ts
import PdfStorage from "../../../utils/pdfStorage";
import { storageMethod } from "../../../utils/env";
import { StorageMethod } from "../../../utils/types";
import { getPdf as supabaseGetPdf } from "../../../utils/supabase";

async function handleRequest(req: Request): Promise<Response> {
  let db: PdfStorage | undefined;
  try {
    const body = await req.json();
    let pdfData: string;

    if (storageMethod === StorageMethod.sqlite) {
      db = new PdfStorage();
      pdfData = await db.getPdf(body.pdfId);
    } else {
      pdfData = await supabaseGetPdf(body.pdfId);
    }

    return new Response(
      JSON.stringify({ pdfData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in handleRequest:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeError) {
        console.error("Error closing database:", closeError);
      }
    }
  }
}

export async function POST(req: Request): Promise<Response> {
  return handleRequest(req);
}
