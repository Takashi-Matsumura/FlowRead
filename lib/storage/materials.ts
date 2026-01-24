import { Material } from '../types';

const STORAGE_KEY = 'flowread_user_materials';

export function getUserMaterials(): Material[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load user materials:', e);
  }

  return [];
}

export function saveUserMaterials(materials: Material[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save user materials:', e);
  }
}

export function addUserMaterial(material: Material): void {
  const materials = getUserMaterials();
  materials.push(material);
  saveUserMaterials(materials);
}

export function deleteUserMaterial(materialId: string): void {
  const materials = getUserMaterials();
  const filtered = materials.filter(m => m.id !== materialId);
  saveUserMaterials(filtered);
}

export function getUserMaterial(materialId: string): Material | undefined {
  const materials = getUserMaterials();
  return materials.find(m => m.id === materialId);
}
