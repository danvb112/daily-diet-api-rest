import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database';

export async function mealRoutes(app: FastifyInstance) {
    app.delete('/:userId/:mealId', async (request, reply) => {
        const deleteMealRequestParam = z.object({
            userId: z.string().uuid(),
            mealId: z.string().uuid(),
        });

        const { mealId, userId } = deleteMealRequestParam.parse(request.params);

        await knex('meals').where({
            id: mealId,
            user_id: userId
        }).delete();

        reply.status(200).send();
    });

    app.get('/:userId', async (request, reply) => {
        const getMealRequestParams = z.object({
            userId: z.string().uuid()
        });

        const { userId } = getMealRequestParams.parse(request.params);

        const meals = await knex('meals').where({
            user_id: userId
        });

        reply.status(200).send({
            meals
        })
    });

    app.get('/:userId/:mealId', async (request, reply) => {
        const getMealRequestParam = z.object({
            userId: z.string().uuid(),
            mealId: z.string().uuid(),
        });

        const { mealId, userId } = getMealRequestParam.parse(request.params);

        const meal = await knex('meals').where({
            id: mealId,
            user_id: userId
        }).select();

        reply.status(200).send({
            meal
        })
    })

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
            id: randomUUID(),
            description,
            diet_meal: dietMeal,
            name,
            user_id: userId
        });

        reply.status(201).send()
    })

    app.put('/:userId/:mealId', async (request, reply) => {
        const putMealRequestParams = z.object({
            userId: z.string().uuid(),
            mealId: z.string().uuid(),
        });

        const putMealRequestBody = z.object({
            name: z.string(),
            description: z.string(),
            dietMeal: z.boolean(),
        });

        const { mealId, userId } = putMealRequestParams.parse(request.params);
        const { description, dietMeal, name } = putMealRequestBody.parse(request.body);

        await knex('meals')
            .where({
                id: mealId,
                user_id: userId
            })
            .update({
                description,
                name,
                diet_meal: dietMeal
            });

        reply.status(200).send();

    })
}