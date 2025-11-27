import { apiRequest } from './client';

export async function register({ email, password, fullName }) {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: fullName
    })
  });

  return res;
}

export async function login({ email, password }) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  return res;
}

export async function logout() {
  const res = await apiRequest('/auth/logout', {
    method: 'POST'
  });
  return res;
}

export async function getProfile() {
  const res = await apiRequest('/auth/profile', {
    method: 'GET'
  });
  return res;
}

