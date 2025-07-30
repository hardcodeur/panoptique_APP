// src/lib/stores/authUserStore.ts
import { writable, get } from 'svelte/store';

export interface UserStore {
    id: string;
    email: string;
    fullName: string;
    role: Role;
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TEAM_MANAGER = 'team_manager',
  USER = 'agent',
}

const createAuthUserStore = () => {
  const { subscribe, set, update } = writable<UserStore>({
    id: "",
    email: "",
    fullName: "",
    role: Role.USER
  });


  return {
    subscribe,
    set,
    update,
    reset: () => set({ id: "", email: "", fullName: "", role: Role.USER }),
    get: () => get({ subscribe })
  };
};

export const userStore = createAuthUserStore();