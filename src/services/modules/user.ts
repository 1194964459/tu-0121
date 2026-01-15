import request from '../request';
import type { User, LoginParams, RegisterParams } from '@/types';

export const userApi = {
  login(params: LoginParams) {
    return request.post<User>('/auth/login', params);
  },

  register(params: RegisterParams) {
    return request.post<User>('/auth/register', params);
  },

  getUsers() {
    return request.get<User[]>('/users');
  },

  getUserInfo(id: number) {
    return request.get<User>(`/users/${id}`);
  },

  updateUser(id: number, data: Partial<User>) {
    return request.put<User>(`/users/${id}`, data);
  },

  deleteUser(id: number) {
    return request.delete(`/users/${id}`);
  }
};
