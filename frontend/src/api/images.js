import { apiRequest } from './client';

export async function uploadImages(plantId, { files, caption, isPrimary }) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  if (caption) {
    formData.append('caption', caption);
  }

  if (isPrimary !== undefined) {
    formData.append('is_primary', isPrimary);
  }

  const res = await apiRequest(`/images/plants/${plantId}`, {
    method: 'POST',
    body: formData
  });

  return res;
}

export async function getImagesByPlant(plantId) {
  const res = await apiRequest(`/images/plants/${plantId}`, { method: 'GET' });
  return res;
}

export async function setPrimaryImage(id) {
  const res = await apiRequest(`/images/${id}/primary`, {
    method: 'PATCH'
  });
  return res;
}

export async function deleteImage(id) {
  const res = await apiRequest(`/images/${id}`, {
    method: 'DELETE'
  });
  return res;
}

