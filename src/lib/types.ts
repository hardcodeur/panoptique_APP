export interface AuthUser {
    id: number;
    email: string;
    roles: string[];
    user: {
        firstName: string;
        lastName: string;
    };
}