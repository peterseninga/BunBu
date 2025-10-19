/**
 * Composable zum Abrufen der Filternavigations-Daten aus Prismic CMS
 * 
 * Funktion laedt die Filternav als Singleton aus Prismic und cached die Daten automatisch
 * @returns {Ref} Reactive reference zu den Filternavigations-Daten aus Prismic
 */
export const useFilternav = () => {
    // Prismic Client-Instanz init
    const prismic = usePrismic()

    // Asynchrone Daten mit Auto-Caching laden
    // "$filternav" als eindeutiger Cache-Key
    return useAsyncData("$filternav", () => {
        return prismic.client.getSingle("filternav")
    }).data
}