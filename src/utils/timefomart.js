function getTime(time) {
  function formatNumber(n) {
    return n < 10 ? `0${n}` : n;
  }
  if (time) {
    const date = new Date(time);
    const times = {
      Y: date.getFullYear(),
      M: formatNumber(date.getMonth() + 1),
      D: formatNumber(date.getDate()),
      h: formatNumber(date.getHours()),
      m: formatNumber(date.getMinutes()),
      s: formatNumber(date.getSeconds()),
    };
    return times;
  }
  return '';
}

export default function timeFormat(time, format = 'Y-M-D h:m:s') {
  if (!time) return '--';
  const times = getTime(time);
  if (times) {
    const reg = RegExp('[YMDhms]+', 'g');
    if (typeof format === 'string') {
      format = format.replace(reg, (s) => {
        return times[s.charAt(0)];
      });
    }
    return format;
  }
}
