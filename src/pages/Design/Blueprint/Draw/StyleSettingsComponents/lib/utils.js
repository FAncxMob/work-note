export function analysisDirectionCSS(val = '', pattern) {
  if (!pattern) return [val];
  const list = [];
  let res;
  while ((res = pattern.exec(val))) {
    list.push(res[1]);
  }

  const [top = 0, left = top, bottom = top, right = left] = list;
  return [top, left, bottom, right];
}

export function makeupDirectionCSS(list) {
  const [top, left, bottom, right] = list;

  let newList = [top, left, bottom, right];

  if (right === left) {
    newList = [top, left, bottom];
  }

  if (bottom === top && right === left) {
    newList = [top, left];
  }

  if (top === left && top === right && top === bottom) {
    newList = [top];
  }
  return newList.filter((i) => i !== undefined);
}
