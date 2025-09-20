import "dotenv/config";
import * as prismic from "@prismicio/client";
import fs, { link } from "node:fs";
import csv from "csv-parser";

import { repositoryName } from "../slicemachine.config.json";

type Book = {
  title: string;
  author: string;
  description: string;
  cover_url: string;
  format: string;
  categories: string;
  slug: string;
};

const books: Book[] = [];

const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

const migration = prismic.createMigration();

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

console.log("📚 Vorschau auf Buchdaten:");
console.log(JSON.stringify(books[0], null, 2));

for (const book of books) {
  console.log(
    "🧪 Format:",
    book.format?.split(",").map((f) => ({ format: f.trim() }))
  );
  console.log(
    "🧪 Kategorien:",
    book.categories?.split(",").map((c) => ({ category: c.trim() }))
  );

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

  migration.createDocument(
    {
      type: "book",
      uid: book.slug,
      lang: "en-us",
      data: {
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
    book.title
  );
}

await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});
2