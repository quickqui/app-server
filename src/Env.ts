export const env: {
    name: string,
    modelUrl: string,
    dataUrl: string,
    extendPath: string
} = (() => {
    if (process.env.ENV === "dev_local")
        return {
            name: 'dev_local',
            modelUrl: 'http://localhost:1111',
            dataUrl: 'http://localhost:4466',
            extendPath: '../../../sizhiComm/searchFeed'
        }
    if (process.env.ENV === "dev_docker")
        return {
            name: 'dev_docker',
            dataUrl: 'http://prisma:4466',
            modelUrl: 'http://model-server:1111',
            extendPath: '/extendDir'
        }
    else throw new Error('unknown environment');
})()