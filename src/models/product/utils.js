function dataSource() {
  return {
    title: '',
    key: '',
    value: '',
    level: 1,
    parentId: '',
    children: [],
  };
}
// 过滤商品分类数据模型至selectTree
export function getCategoryModelData(arr) {
  return arr.map((item) => {
    const data = dataSource();
    data.title = item.name;
    data.key = item.id;
    data.value = item.id;
    data.level = item.level;
    data.parentId = item.parentId;
    data.platformCommissionRate = item.platformCommissionRate;
    data.disabled = item.level === 1;
    if (item.childCategories && item.childCategories.length > 0) {
      data.children = getCategoryModelData(item.childCategories);
    }
    return data;
  });
}
// 过滤城市数据模型至selectTree
export function getCityModelData(tree, res, province) {
  // select下拉列表的转化方式
  return res.map((item) => {
    return {
      value: item.city,
      text: item.city,
    };
  });
  // treeSelect树形是的转化方式
  // if (!province) {
  //   return res.map((item) => {
  //     const itemData = dataSource();
  //     itemData.title = item.name;
  //     itemData.key = item.name;
  //     itemData.value = item.name;
  //     return itemData;
  //   });
  // }
  // for (const item of tree) {
  //   if (item.title === province) {
  //     item.children = item.children.concat(
  //       res.map((itemRes) => {
  //         const itemData = dataSource();
  //         itemData.title = itemRes.name;
  //         itemData.key = itemRes.name;
  //         itemData.value = itemRes.name;
  //         return itemData;
  //       }),
  //     );
  //     break;
  //   }
  // }
  // return tree;
}
