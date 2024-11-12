import { auth } from "@clerk/nextjs/server"

const allowedIds = [
    "user_2iw8cnMZRTDP2EPBQvz4Ho5eoG3"
]
export const isAdmin = async () => {
    const { userId } = await auth()

    if (!userId) {
        return false
    }
    
    return allowedIds.indexOf(userId) !== -1
}