import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { z } from 'zod';

export async function userRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const usersList = await knex('users').select();

        return { users: usersList };
    });

    app.get('/:id', async (request) => {
        const getUserRequestParamsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = getUserRequestParamsSchema.parse(request.params);

        const user = await knex('users').where({
            id
        }).select();

        return user;

    })

    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string()
        });

        const { name, email } = createUserBodySchema.parse(request.body);

        const id = randomUUID();

        await knex('users').insert({
            email,
            id,
            name,
        });

        const createdUser = await knex('users').where({
            id
        }).select();

        reply.status(201).send({ createdUser });
    });
}