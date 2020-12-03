export const openStatus = [
  { value: 0, label: '开启', color: 'green' },
  { value: 1, label: '禁用', color: 'red' },
];
export function _openStatus (val) {
  if (val === 0) return '开启';
  if (val === 1) return '禁用';
}