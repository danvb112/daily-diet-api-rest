import fastify from "fastify";
import cookeis from '@fastify/cookie';
import { userRoutes } from "./routes/usersRoutes";

export const app = fastify();

app.register(cookeis);
app.register(userRoutes, {
    prefix: 'users'
})