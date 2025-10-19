import "dotenv/config";
import * as prismic from "@prismicio/client";
import fs, { link } from "node:fs";
import csv from "csv-parser";

import { repositoryName } from "../slicemachine.config.json";

// Typdefinition fuer ein Buch aus der CSV-Datei
type Book = {
  title: string;
  author: string;
  description: string;
  cover_url: string;
  format: string;
  categories: string;
  slug: string;
};

// Array zum Speichern aller Buecher
const books: Book[] = [];

// Prismic Write Client init fuer API-Zugriff
const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

// Migration-Objekt erstellen fuer Bulk-Import
const migration = prismic.createMigration();

// CSV-Datei asynchron einlesen und parsen
await new Promise<void>((resolve, reject) => {
  fs.createReadStream("./books.csv")
    .pipe(
      csv({
        separator: ";",
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
      })
    )
    .on("data", (row) => books.push(row))
    .on("end", resolve);
});

// Debugging: Erstes Buch ausgeben um Datenstruktur zu pruefen
console.log("Vorschau auf Buchdaten:");
console.log(JSON.stringify(books[0], null, 2));

// Ueber alle Buecher iterieren und Prismic-Dokumente erstellen
for (const book of books) {
  // Debug-Ausgaben
  console.log(
    "Format:",
    book.format?.split(",").map((f) => ({ format: f.trim() }))
  );
  console.log(
    "Kategorien:",
    book.categories?.split(",").map((c) => ({ category: c.trim() }))
  );

  // Helpsfunction: Komma-separierte Strings in Prismic-Gruppen-Format umwandeln
  function toGroupArray(
    csvValue: string,
    key: string
  ): { [key: string]: string }[] {
    return (
      csvValue
        ?.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => ({ [key]: item })) ?? []
    );
  }

  // Neues Prismic-Dokument zur Migration hinzufuegen
  migration.createDocument(
    {
      type: "book",
      uid: book.slug,
      lang: "en-us",
      data: {
        // Hauptfelder des Dokuments
        title: [{ type: "heading4", text: book.title }],
        author: [{ type: "paragraph", text: book.author }],
        description: [{ type: "paragraph", text: book.description }],
        cover_url: book.cover_url,
        format:
          book.format?.split(",").map((f) => ({ formaat: f.trim() })) ?? [],
        categories:
          book.categories?.split(",").map((c) => ({ category: c.trim() })) ??
          [],
          slices: [
        {
          slice_type: "detailslice",
          slice_label: null,
          variation: "default",
          primary: {
            title: [{ type: "heading4", text: book.title }],
            author: [{ type: "paragraph", text: book.author }],
            beschreibung: [{ type: "paragraph", text: book.description }],
            cover_url: book.cover_url,
            kategorien: toGroupArray(book.categories, "label"),
            formate: toGroupArray(book.format, "format"),
          },
        },
      ],

      },
    },
    book.title // Name/Label fuer das Dokument in Prismic
  );
}

// Migration ausfuehren und Events loggen
await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});