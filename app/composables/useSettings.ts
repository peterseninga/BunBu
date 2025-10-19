/**
 * Composable zum Abrufen der globalen Einstellungen aus Prismic CMS
 * 
 * Diese Funktion lädt die Settings als Singleton aus Prismic
 * und cached die Daten automatisch durch useAsyncData.
 * Die Settings enthalten typischerweise globale Konfigurationen
 * wie Site-Metadaten, Social-Media-Links, etc.
 * 
 * @returns {Ref} Reactive reference zu den Settings-Daten aus Prismic
 */
export const useSettings = () => {
    // Prismic Client-Instanz initialisieren
    const prismic = usePrismic()
    
    // Asynchrone Daten mit Auto-Caching laden
    // "$settings" ist der eindeutige Cache-Key
    // getSingle("settings") lädt das Singleton-Dokument vom Typ "settings"
    return useAsyncData("$settings", () => {
        return prismic.client.getSingle("settings")
    }).data
}