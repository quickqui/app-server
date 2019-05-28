import { prisma } from './src/generated/prisma-client'

async function main() {
  await prisma.createUser({
    email: 'alice@prisma.io',
    name: 'Alice',
    password: 'secret42', // "secret42"
  })
  await prisma.createUser({
    email: 'bob@prisma.io',
    name: 'Bob',
    password: 'secret43', // "secret43"
  })
}

main()
