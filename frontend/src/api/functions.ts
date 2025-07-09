import axios from 'axios';

//-----------------------------------------------------------------------------
export type ObjFile = {
  id: string;
  name: string;
  creation_date: Date;
  size: number;
};

//-----------------------------------------------------------------------------
type Vector3 = {
  x: number;
  y: number;
  z: number;
};

function stringifyVector(name: string, vector: Vector3): string {
  return `${name}  ${vector.x}  ${vector.y}  ${vector.z}`;
}

const apiClient = axios.create({ baseURL: 'http://localhost:3333/api' });

//-----------------------------------------------------------------------------
export async function listFiles(): Promise<ObjFile[]> {
  const res = await apiClient.request<ObjFile[]>({
    method: 'GET',
    url: 'files',
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function getFile(fileId: string): Promise<ObjFile> {
  const res = await apiClient.request<ObjFile>({
    method: 'GET',
    url: 'files',
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function renameFile(fileId: string, newName: string): Promise<ObjFile> {
  const res = await apiClient.request<ObjFile>({
    method: 'PUT',
    url: `files/${fileId}`,
    data: { name: newName },
  });
  return res.data;
}

//-----------------------------------------------------------------------------
export async function deleteFile(fileId: string): Promise<void> {
  await apiClient.request<ObjFile>({
    method: 'DELETE',
    url: `files/${fileId}`,
  });
}

//-----------------------------------------------------------------------------
export function downloadFile(fileId: string): void {
  const downloadUrl = `http://localhost:3333/downloads/${fileId}`;
  window.open(downloadUrl, '_blank');
}

//-----------------------------------------------------------------------------
export async function uploadFile(data: FormData): Promise<ObjFile> {
  const res = await apiClient.request<ObjFile>({
    method: 'POST',
    url: 'files',
    data,
  });

  return res.data;
}

//-----------------------------------------------------------------------------
export function transformFile(fileId: string, scale: Vector3, offset: Vector3): void {
  const transformUrl = `http://localhost:3333/api/transform/${fileId}?scale=${stringifyVector(
    'scale',
    scale,
  )}&offset=${stringifyVector('offset', offset)}`;
  window.open(transformUrl, '_blank');
}
