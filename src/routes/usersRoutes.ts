import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { z } from 'zod';

export async function userRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string()
        });

        const { name, email } = createUserBodySchema.parse(request.body);

        await knex('users').insert({
            email,
            id: randomUUID(),
            name,
        });

        reply.status(201).send();
    })
}