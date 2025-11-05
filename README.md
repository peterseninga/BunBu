# Bunbu - Barrierefreie Kinderbücher

Eine Sammlung barrierefreier Kinderbücher, entwickelt mit [Prismic][prismic] und [Nuxt][nuxt].

- **Live-Demo**: [bunbu.vercel.app](https://bunbu.vercel.app)
- **Prismic & Nuxt Dokumentation**: [Prismic Nuxt Documentation][prismic-docs]

&nbsp;

## Über das Projekt

Bunbu ist eine digitale Sammlung barrierefreier Kinderbücher. Die Plattform wurde entwickelt, um Erziehungspersonen von eingeschränkten Kindern und pädagogischen Fachkräften den Zugang zur Literatur zu erleichtern.

### Barrierefreiheit

Die Webseite legt besonderen Wert auf:
- Klare und einfache Navigation
- Lesbare Schriftarten und Kontraste
- Responsive Design für alle Geräte

&nbsp;

## Schnellstart

Um dieses Projekt lokal zu starten, führe folgende Befehle im Terminal aus:

```sh
git clone <bunbu>
cd bunbu
npm install
```

Anschließend starte den Entwicklungsserver:

```sh
npm run dev
```

Die Webseite ist dann unter `http://localhost:3000` erreichbar.

## Inhalte verwalten

### Prismic CMS

Die Inhalte werden über [Prismic](https://prismic.io/dashboard) verwaltet. Um Bücher hinzuzufügen oder zu bearbeiten:

1. Melde dich im Prismic Dashboard an
2. Wähle das Bunbu Repository aus
3. Erstelle oder bearbeite Inhalte

### Neues Buch hinzufügen

1. Klicke im Prismic Dashboard auf das grüne Stift-Symbol
2. Wähle den entsprechenden Content-Type für Bücher
3. Fülle die Felder aus (Titel, Autor, Beschreibung, Cover-Bild, etc.)
4. Füge Slices für den Buchinhalt hinzu
5. Veröffentliche das Dokument

### Sammlung organisieren

Die Bücher werden automatisch in der Sammlung angezeigt. Du kannst:
- Bücher nach Kategorien sortieren
- Barrierefreiheits-Features kennzeichnen

## Vorschau-Funktion

Die Webseite ist für Vorschauen in der Entwicklung unter `localhost:3000` vorkonfiguriert.

Für eine Produktions-Vorschau:
1. Gehe zu _Settings > Previews_ in deinem Prismic Repository
2. Erstelle eine neue Vorschau mit:
   - **Name**: Production
   - **Domain**: https://bunbu.vercel.app
   - **Preview Route**: `/api/preview`

## Projekt-Struktur

### Wichtige Dateien

- `nuxt.config.js` - Konfiguration für Prismic und Nuxt
- `pages/index.vue` - Startseite mit der Büchersammlung
- `pages/[uid].vue` - Dynamische Seiten für einzelne Bücher
- `slices/` - Wiederverwendbare Komponenten für Buchinhalte

### Slice Machine

Dieses Projekt nutzt Slice Machine für die Content-Modellierung. Um Custom Types oder Slices zu bearbeiten:

```sh
npm run slicemachine
```

Mehr Informationen: [Model Content in Nuxt](https://prismic.io/docs/technologies/nuxt-model-content)

## Deployment

Das Projekt ist auf [Vercel](https://vercel.com) deployed. Bei jedem Push auf den Main-Branch wird automatisch eine neue Version veröffentlicht.

Manuelle Deployment-Befehle:

```sh
npm run build
npm run preview
```

## Technologie-Stack

- **Frontend**: Nuxt 3
- **CMS**: Prismic
- **Hosting**: Vercel
- **Styling**: TailwindCSS

## Lizenz

```
Copyright 2013-2023 Prismic <contact@prismic.io> (https://prismic.io)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

**Bunbu** - Bunte Bücher

[prismic]: https://prismic.io
[prismic-docs]: https://prismic.io/docs/nuxt-3-setup
[nuxt]: https://nuxt.com