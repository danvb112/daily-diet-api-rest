import { execSync } from 'node:child_process';
import { describe, it, beforeAll, afterAll, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('User Routes', async () => {
    beforeAll(async () => {
        await app.ready();
    });

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all');
        execSync('npm run knex migrate:latest');
    })

    afterAll(async () => {
        await app.close();
    });

    it('should be able to create a new user', async () => {
        const postUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "User 1",
                email: "user1@email.com"
            }).expect(201);

        expect(postUserResponse.body.createdUser).toEqual([
            expect.objectContaining({
                name: "User 1",
                email: "user1@email.com"
            })
        ]);
    });

    it('should be able to get all users', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "User 1",
                email: "user1@email.com"
            }).expect(201);

        await request(app.server)
            .post('/users')
            .send({
                name: "User 2",
                email: "user2@email.com"
            }).expect(201);

        const usersRequest = await request(app.server).get('/users');

        expect(usersRequest.body.users).toEqual([
            expect.objectContaining({
                name: "User 1",
                email: "user1@email.com"
            }),

            expect.objectContaining({
                name: "User 2",
                email: "user2@email.com"
            }),
        ]);
    });

    it('should be able to get an user by id', async () => {
        const postUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "User 1",
                email: "user1@email.com"
            }).expect(201);

        console.log(postUserResponse.body.createdUser);

        const { id } = postUserResponse.body.createdUser[0];


        const getUserByIdResponse = await request(app.server)
            .get(`/users/${id}`);

        expect(getUserByIdResponse.body).toEqual([
            expect.objectContaining({
                name: "User 1",
                email: "user1@email.com"
            })
        ]);
    });
})