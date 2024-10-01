// app/utils/pdfStorage.ts

import SQLiteDatabase from "./sqliteUtils";

class pdfStorage {
  private db: SQLiteDatabase;

  constructor() {
    this.db = new SQLiteDatabase();
  }

  /**
   * Save a PDF to the database.
   * @param pdfPath The path to the PDF file on the server.
   * @param id The unique ID to store the PDF under.
   */
  async savePdf(pdfPath: string, id: string): Promise<void> {
    await this.db.savePdf(pdfPath, id);
  }

  /**
   * Retrieve a PDF from the database.
   * @param id The ID of the PDF to retrieve.
   * @returns A base64-encoded string of the PDF file.
   */
  async getPdf(id: string): Promise<string> {
    return await this.db.getPdf(id);
  }

  /**
   * Delete a PDF from the database by its ID.
   * @param id The ID of the PDF to delete.
   */
  async deletePdf(id: string): Promise<void> {
    const sql = `DELETE FROM pdfs WHERE id = ?`;
    await this.db.run(sql, [id]);
  }

  async close(): Promise<void> {
    await this.db.close();
  }

  // BONUS: Export PDF data to a file (optional)
  async exportPdfToJson(id: string, filePath: string): Promise<void> {
    const pdfData = await this.getPdf(id);
    const json = JSON.stringify({ id, pdfData });
    const fs = await import("fs/promises");
    await fs.writeFile(filePath, json);
  }

  // BONUS: Import PDF data from a JSON file (optional)
  async importPdfFromJson(filePath: string): Promise<void> {
    const fs = await import("fs/promises");
  }
}

export default pdfStorage;
