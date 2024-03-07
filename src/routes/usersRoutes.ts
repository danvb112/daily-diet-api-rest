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

    });

    app.get('/:id/summary', async (request, reply) => {
        const getUserRequestParamsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = getUserRequestParamsSchema.parse(request.params);

        const summary = await knex('meals')
            .select(
                knex.raw('COUNT(*) as totalMeals'),
                knex.raw('SUM(CASE WHEN diet_meal = true THEN 1 ELSE 0 END) as mealsWithinTheDiet'),
                knex.raw('SUM(CASE WHEN diet_meal = false THEN 1 ELSE 0 END) as mealsOutsideTheDiet')
            )
            .where('user_id', id)
            .first();

        const [bestSequenceSummary] = await knex.raw(`
            SELECT user_id, 
                COUNT(*) AS sequence_length,
                MIN(created_at) AS start_date,
                MAX(created_at) AS end_date
            FROM (
                SELECT user_id, 
                    created_at,
                    ROW_NUMBER() OVER (ORDER BY created_at) - 
                    ROW_NUMBER() OVER (PARTITION BY user_id, diet_meal ORDER BY created_at) AS sequence
                FROM meals
                WHERE user_id = ?
                AND diet_meal = true
            ) AS sequences
            GROUP BY user_id, sequence
            ORDER BY sequence_length DESC
            LIMIT 1
        `, [id]);

        reply.status(200).send({
            ...summary,
            bestSequenceNumber: bestSequenceSummary.sequence_length,
            startDate: bestSequenceSummary.start_date,
            endDate: bestSequenceSummary.end_date
        })
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