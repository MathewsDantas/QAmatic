const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;

export const relativeTime = (dateString) => {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'agora mesmo';
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return `h\u00e1 ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return `h\u00e1 ${h} ${h === 1 ? 'hora' : 'horas'}`;
  }
  if (diff < WEEK) {
    const d = Math.floor(diff / DAY);
    return `h\u00e1 ${d} ${d === 1 ? 'dia' : 'dias'}`;
  }
  if (diff < MONTH) {
    const w = Math.floor(diff / WEEK);
    return `h\u00e1 ${w} ${w === 1 ? 'semana' : 'semanas'}`;
  }

  return new Date(dateString).toLocaleDateString('pt-BR');
};
