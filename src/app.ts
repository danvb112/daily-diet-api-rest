import fastify from "fastify";
import cookeis from '@fastify/cookie';

export const app = fastify();

app.register(cookeis);