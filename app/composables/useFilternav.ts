export const useFilternav = () => {
    const prismic = usePrismic()
    return useAsyncData("$filternav", () => {
        return prismic.client.getSingle("filternav")
    }).data
}