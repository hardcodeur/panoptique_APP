export interface AuthUser {
    id: number;
    email: string;
    roles: string[];
    user: {
        firstName: string;
        lastName: string;
    };
}

export interface SelectInputValue {
    value: string;
    name: string;
}

export type FormField = 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'team';

export type FormSchemas = {
    [key in FormField]?: string;
};

export interface FormStore {
    errors: FormSchemas;
    values: FormSchemas;
}

