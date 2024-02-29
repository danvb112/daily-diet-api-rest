import { Knex } from 'knex';

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string;
            name: string;
            email: string;
        };
        meals: {
            id: string;
            name: string;
            description: string;
            created_at: string;
            diet_meal: boolean;
            user_id: string;
        }
    }
}