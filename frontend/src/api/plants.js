import { apiRequest } from './client';

export async function listPlants(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  const path = queryString ? `/plants?${queryString}` : '/plants';

  const res = await apiRequest(path, { method: 'GET' });
  return res;
}

export async function getPlant(id) {
  const res = await apiRequest(`/plants/${id}`, { method: 'GET' });
  return res;
}

export async function createPlant(payload) {
  const res = await apiRequest('/plants', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res;
}

export async function updatePlant(id, payload) {
  const res = await apiRequest(`/plants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return res;
}

export async function deletePlant(id) {
  const res = await apiRequest(`/plants/${id}`, {
    method: 'DELETE'
  });
  return res;
}

export async function getPlantStatistics() {
  const res = await apiRequest('/plants/statistics', { method: 'GET' });
  return res;
}

