export interface AuthUser {
    userId: string;
    role: string;
}


// export interface AuthUser {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     roles: string;
//     team : string;
//     createdAt : string;
//     updatedAt : string;
//     lastLogin : string;
// }

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

