import type { PageableProps } from "../../scripts/Types";

import {
  getRequest,
  patchRequestNoBody,
  postRequest,
  deleteRequestNoBody,
  patchRequest,
  postPublicRequest,
  type ResponseEntity,
} from "../ApiFunctions";

export interface RefreshTokenType {
  sub: string;
  type: string;
  iat: number;
  exp: number;
}

export interface LoginType {
  username: string;
  password: string;
}

export interface AccessTokenType {
  sub: string;
  first_name: string;
  last_name: string;
  role: string;
  type: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
  lastLoginAt: Date;
  createdAt: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export interface UserEdit {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  department: string;
  userRoles: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
}

export interface EditProfile {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface ChangePasswordAdminRequest {
  newPassword1: string;
  newPassword2: string;
}

export interface UserResponse {
  users: User[];
  numPageUsers: number;
}

export interface UserFilterProps {
  FilterItems: (data: FilterUserProps) => void;
  ResetItems: () => void;
  roles: string[];
}

export interface FilterUserProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  department?: string;
}

export async function reqLoginInto(data: LoginType) {
  return await postPublicRequest<LoginResponse, LoginType>(
    "/api/auth/login",
    data,
  );
}

export async function changePassword(data: ChangePasswordRequest) {
  return await patchRequest<ResponseEntity, ChangePasswordRequest>(
    `users/profile/password`,
    data,
  );
}

export async function changePasswordAdmin(
  id: number,
  data: ChangePasswordAdminRequest,
) {
  return await patchRequest<ResponseEntity, ChangePasswordAdminRequest>(
    `/users/edit/password/${id}`,
    data,
  );
}

export async function getUserResponse() {
  return await getRequest<UserResponse>("/users");
}

export async function ChangePageUser(obj: PageableProps) {
  return await getRequest<UserResponse>("/users", obj);
}

export async function addUser(data: UserRequest) {
  return await postRequest<ResponseEntity, UserRequest>(`/users/add`, data);
}

export async function editUser(id: number, data: UserEdit) {
  return await patchRequest<ResponseEntity, UserEdit>(
    `/users/edit/${id}`,
    data,
  );
}

export async function makeAdministrator(id: number) {
  return await patchRequestNoBody<ResponseEntity>(`/users/${id}`);
}

export async function deleteUser(id: number) {
  return await deleteRequestNoBody<ResponseEntity>(`/users/delete/${id}`);
}

export async function restoreUser(id: number) {
  return await patchRequestNoBody<ResponseEntity>(`/users/restore/${id}`);
}

export async function getProfile() {
  return await getRequest<User>("/users/profile");
}

export async function editProfile(data: EditProfile) {
  return await patchRequest<ResponseEntity, EditProfile>(
    "/users/profile/edit",
    data,
  );
}

export async function reqFilterUsers(data: FilterUserProps) {
  return await getRequest<UserResponse>("/users", data);
}
