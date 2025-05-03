import { NextResponse } from "next/server"


const paginate = (page: number, take: number) => ({
    take, skip: page * take
})

const jsonError = (message: string, status = 400) => NextResponse.json({ error: true, message, }, { status })

export { paginate, jsonError }