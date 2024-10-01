// app/utils/sqliteUtils.ts

import sqlite3 from "sqlite3";
import path from "path";
import { StoredHighlight, StoredPdf } from "./types";
import fs from 'fs';


class SQLiteDatabase {
  private db: sqlite3.Database;
  private tableName: string = "highlights";
  private migrationPromise: Promise<void>;

  constructor() {
    this.db = new sqlite3.Database(
      path.join(process.cwd(), "highlights.db"),
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (error) => {
        if (error) {
          console.error("Error opening database:", error.message);
        } else {
          console.log("Connected to highlights db!");
        }
      }
    );
    this.migrationPromise = this.migrate();
  }

  private migrate(): Promise<void> {
    return new Promise((resolve, reject) => {
      const highlightTableSQL = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          id TEXT,
          pdfId TEXT,
          pageNumber INTEGER NOT NULL,
          x1 REAL NOT NULL,
          y1 REAL NOT NULL,
          x2 REAL NOT NULL,
          y2 REAL NOT NULL,
          width REAL,
          height REAL,
          text TEXT,
          image TEXT,
          keyword TEXT,
          PRIMARY KEY (id, pdfId)
        )
      `;
      const pdfTableSQL = `
        CREATE TABLE IF NOT EXISTS pdfs (
          id TEXT PRIMARY Key,
          filename TEXT, 
          filedata BLOB 
        )
      `;
      this.db.run(highlightTableSQL, (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
          reject(err);
        } else {
          console.log("Highlights table created or already exists");
          resolve();
        }
      });
      this.db.run(pdfTableSQL, (pdfError) => {
        if (pdfError) {
          console.error("Error creating PDF table:", pdfError.message);
          reject(pdfError);
        } else {
          console.log("PDF table created or already exists");
          resolve();
        }
      });
    });
  }

  private async ensureMigrated(): Promise<void> {
    await this.migrationPromise;
  }

  private pdfToBase64(pdfPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(pdfPath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

  private bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }
  

  async savePdf(pdfPath: string, id: string): Promise<void> {
    await this.ensureMigrated();

    const correctedPdfPath = pdfPath.replace(/__pdf$/, '.pdf');

    const fileDataBuffer = await this.pdfToBase64(correctedPdfPath); 
    const fileDataBase64 = this.bufferToBase64(fileDataBuffer); 

    const sql = `INSERT OR REPLACE INTO pdfs (id, filename, filedata) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
        this.db.run(sql, [id, path.basename(correctedPdfPath), fileDataBase64], (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

  async getPdf(id: string): Promise<StoredPdf> {
    await this.ensureMigrated();
    const sql = `SELECT id, filename, filedata FROM pdfs WHERE id = ?`;

    return new Promise((resolve, reject) => {
        this.db.get(sql, [id], (error, row) => {
            if (error) {
                reject(error);
            } else if (row) {
                // Create a StoredPdf object
                const storedPdf: StoredPdf = {
                    id: row.id,
                    filename: row.filename,
                    filedata: Buffer.from(row.filedata, 'base64')
                };
                resolve(storedPdf);
            } else {
                reject(new Error("PDF not found"));
            }
        });
    });
}
  
  

  async saveHighlight(highlight: StoredHighlight): Promise<void> {
    await this.ensureMigrated();
    const sql = `INSERT OR REPLACE INTO ${this.tableName} (id, pdfId, pageNumber, x1, y1, x2, y2, width, height, text, image, keyword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, Object.values(highlight), (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async saveBulkHighlights(highlights: StoredHighlight[]): Promise<void> {
    await this.ensureMigrated();
    const sql = `INSERT OR REPLACE INTO ${this.tableName} (id, pdfId, pageNumber, x1, y1, x2, y2, width, height, text, image, keyword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("BEGIN TRANSACTION");
        const stmt = this.db.prepare(sql);
        highlights.forEach((highlight) => {
          stmt.run(Object.values(highlight));
        });
        stmt.finalize((error) => {
          if (error) {
            this.db.run("ROLLBACK");
            reject(error);
          } else {
            this.db.run("COMMIT", (commitError) => {
              if (commitError) reject(commitError);
              else resolve();
            });
          }
        });
      });
    });
  }

  async getHighlightsForPdf(pdfId: string): Promise<StoredHighlight[]> {
    await this.ensureMigrated();
    const sql = `SELECT * FROM ${this.tableName} WHERE pdfId = ?`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, [pdfId], (error, rows) => {
        if (error) reject(error);
        else resolve(rows as StoredHighlight[]);
      });
    });
  }

  async deleteHighlight(pdfId: string, id: string): Promise<void> {
    await this.ensureMigrated();
    const sql = `DELETE FROM ${this.tableName} WHERE pdfId = ? AND id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [pdfId, id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async close(): Promise<void> {
    await this.ensureMigrated();
    return new Promise((resolve, reject) => {
      this.db.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

export default SQLiteDatabase;
