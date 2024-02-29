import fastify from "fastify";
import cookeis from '@fastify/cookie';
import { userRoutes } from "./routes/usersRoutes";
import { mealRoutes } from "./routes/mealRoutes";

export const app = fastify();

app.register(cookeis);
app.register(userRoutes, {
    prefix: 'users'
})
app.register(mealRoutes, {
    prefix: 'meals'
})