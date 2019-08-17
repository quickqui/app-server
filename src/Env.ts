export const env: {
    name: string, dataUrl: string
} = (() => {
    if (process.env.ENV === "dev_local")
        return { name: 'dev_local', dataUrl: 'http://localhost:4466' }
    if (process.env.ENV === "dev_docker")
        return { name: 'dev_docker', dataUrl: 'http://prisma:4466' }
    else throw new Error('unknown environment');
})()