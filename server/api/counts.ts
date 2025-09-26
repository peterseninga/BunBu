import { readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'csv-parse/sync'

interface BookEntry {
  title: string
  author: string
  format: string
  categories: string
  cover_url: string
  description: string
  slug: string
}

export default defineEventHandler(() => {
  const filePath = join(process.cwd(), 'public', 'books.csv')
  const csvText = readFileSync(filePath, 'utf-8')

  const records = parse<BookEntry>(csvText, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';'
  })

  const formatCounts: Record<string, number> = {
    Buch: 0,
    Hörbuch: 0,
    Braille: 0,
    'E-Book': 0
  }

  const categoryCounts: Record<string, number> = {
    'Leseförderung & Bildung': 0,
    'Frühförderung & Babythemen': 0,
    'Leichte Sprache & Barrierefreiheit': 0,
    'Mehrsprachigkeit & Migration': 0,
    'Gewalt & Missbrauch': 0,
    'Diskriminierung': 0,
    'Mobbing & Ausgrenzung': 0,
    'Körperbild': 0,
    'Kreativität & Fantasie': 0,
    'Emotionale Intelligenz & Empathie': 0,
    'Gemeinschaft': 0,
    'Konsens & Autonomie': 0,
    'Selbstbewusstsein & Selbstliebe': 0,
    'Psychische Gesundheit': 0,
    'Freundschaft & Familie': 0,
    'Detektivische Lebenswelten': 0,
    'Tiere': 0,
    'Soziale Medien': 0,
    'Coolness': 0,
    'Vielfalt & Diversität': 0,
    'Inklusion & Behinderung': 0,
    'Religion & Glaube': 0,
    'Toleranz & Respekt': 0,
    'Gleichberechtigung & Rollenbilder': 0,
    'Gerechtigkeit & Konfliktlösung': 0
  }

  for (const row of records) {
    const rawFormats = row.format?.split(',') || []
    for (const raw of rawFormats) {
      const format = raw.trim()
      if (formatCounts.hasOwnProperty(format)) {
        formatCounts[format]++
      }
    }

    const rawCategories = row.categories?.split(',') || []
    for (const raw of rawCategories) {
      const category = raw.trim()
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++
      }
    }
  }

  return {
    formats: formatCounts,
    categories: categoryCounts
  }
})