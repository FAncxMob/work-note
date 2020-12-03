function formatData(data, map) {
  return map.map((item) => {
    const { key, formatFn } = item;
    if (!data[key] && data[key] !== 0) return item;
    if (!formatFn) return { ...item, value: data[key] };
    return { ...item, value: formatFn(data[key]) };
  });
}

export { formatData };
