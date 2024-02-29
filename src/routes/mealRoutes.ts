import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database';

export async function mealRoutes(app: FastifyInstance) {
    app.post('/:userId', async (request, reply) => {
        const postMealRequestParams = z.object({
            userId: z.string().uuid()
        });

        const postMealRequestBody = z.object({
            name: z.string(),
            description: z.string(),
            dietMeal: z.boolean(),
        })

        const { userId } = postMealRequestParams.parse(request.params);
        const { description, dietMeal, name } = postMealRequestBody.parse(request.body);

        await knex('meals').insert({
            description,
            diet_meal: dietMeal,
            name,
            user_id: userId
        });

        reply.status(201).send()
    })
}