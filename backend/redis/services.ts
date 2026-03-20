import client from "./index.ts"

export const getCachedData = async (key: string) => {
    try {
        const data = await client.get(key)
        if (data) return JSON.parse(data)
        return null
    } catch (err) {
        console.error("Redis Get Error:", err)
        return null
    }
}

export const setCachedData = async (key: string, data: any, ttlInSeconds = 60) => {
    try {
        await client.setEx(key, ttlInSeconds, JSON.stringify(data))
    } catch (err) {
        console.error("Redis Set Error:", err)
    }
}

export const invalidateUserCache = async (userId: number) => {
    try {
        const listKeys = await client.keys(`tasks:user:${userId}:*`)
        if (listKeys.length > 0) {
            await client.del(listKeys)
        }
        const taskKeys = await client.keys(`task:*:user:${userId}`)
        if (taskKeys.length > 0) {
            await client.del(taskKeys)
        }
    } catch (err) {
        console.error("Redis Invalidate Error:", err)
    }
}
