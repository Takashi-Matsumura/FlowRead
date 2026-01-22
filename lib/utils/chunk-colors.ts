import { ChunkRole } from '../types';

export interface RoleColorSet {
  bg: string;
  border: string;
  text: string;
}

export const roleColors: Record<ChunkRole, RoleColorSet> = {
  subject:    { bg: 'bg-blue-50',    border: 'border-blue-300',   text: 'text-blue-700' },
  verb:       { bg: 'bg-green-50',   border: 'border-green-300',  text: 'text-green-700' },
  object:     { bg: 'bg-amber-50',   border: 'border-amber-300',  text: 'text-amber-700' },
  complement: { bg: 'bg-purple-50',  border: 'border-purple-300', text: 'text-purple-700' },
  modifier:   { bg: 'bg-rose-50',    border: 'border-rose-300',   text: 'text-rose-700' },
  time:       { bg: 'bg-cyan-50',    border: 'border-cyan-300',   text: 'text-cyan-700' },
  place:      { bg: 'bg-teal-50',    border: 'border-teal-300',   text: 'text-teal-700' },
  reason:     { bg: 'bg-orange-50',  border: 'border-orange-300', text: 'text-orange-700' },
  condition:  { bg: 'bg-indigo-50',  border: 'border-indigo-300', text: 'text-indigo-700' },
  connector:  { bg: 'bg-gray-50',    border: 'border-gray-300',   text: 'text-gray-600' },
  intro:      { bg: 'bg-slate-50',   border: 'border-slate-300',  text: 'text-slate-600' },
};

// ダークモード用のカラー
export const roleDarkColors: Record<ChunkRole, RoleColorSet> = {
  subject:    { bg: 'dark:bg-blue-900/30',    border: 'dark:border-blue-600',   text: 'dark:text-blue-300' },
  verb:       { bg: 'dark:bg-green-900/30',   border: 'dark:border-green-600',  text: 'dark:text-green-300' },
  object:     { bg: 'dark:bg-amber-900/30',   border: 'dark:border-amber-600',  text: 'dark:text-amber-300' },
  complement: { bg: 'dark:bg-purple-900/30',  border: 'dark:border-purple-600', text: 'dark:text-purple-300' },
  modifier:   { bg: 'dark:bg-rose-900/30',    border: 'dark:border-rose-600',   text: 'dark:text-rose-300' },
  time:       { bg: 'dark:bg-cyan-900/30',    border: 'dark:border-cyan-600',   text: 'dark:text-cyan-300' },
  place:      { bg: 'dark:bg-teal-900/30',    border: 'dark:border-teal-600',   text: 'dark:text-teal-300' },
  reason:     { bg: 'dark:bg-orange-900/30',  border: 'dark:border-orange-600', text: 'dark:text-orange-300' },
  condition:  { bg: 'dark:bg-indigo-900/30',  border: 'dark:border-indigo-600', text: 'dark:text-indigo-300' },
  connector:  { bg: 'dark:bg-gray-800/30',    border: 'dark:border-gray-600',   text: 'dark:text-gray-400' },
  intro:      { bg: 'dark:bg-slate-800/30',   border: 'dark:border-slate-600',  text: 'dark:text-slate-400' },
};

export function getChunkColorClasses(role: ChunkRole): string {
  const light = roleColors[role];
  const dark = roleDarkColors[role];
  return `${light.bg} ${light.border} ${light.text} ${dark.bg} ${dark.border} ${dark.text}`;
}
