interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
}

const getConfig = (config: Partial<TreeHelperConfig>) =>
  Object.assign({}, DEFAULT_CONFIG, config)

// 查找树所有父级
export function findTreeParents<T = any>(
  tree: T[],
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const { children } = getConfig(config)
  const parents: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      parents.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children] && list.unshift(...node[children])
      parents.push(node)
      if (func(node)) {
        return parents
      }
    }
  }
  return parents
}

// 查找树节点
export function findTreeNode<T = any>(
  tree: T[],
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] | null {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}

// 过滤树结构
export function filterTree<T = any>(
  tree: T[],
  filterFn: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const { children } = getConfig(config)
  return tree.filter((node) => {
    const isFilter = filterFn(node)
    if (!isFilter && node[children]?.length) {
      node[children] = filterTree(node[children], filterFn, config)
    }
    return isFilter
  })
}

// 排序树结构
export function sortTree<T = any>(
  tree: T[],
  sortFn: (a: T, b: T) => number,
  config: Partial<TreeHelperConfig> = {},
) {
  const { children } = getConfig(config)
  tree = tree.sort(sortFn)
  tree.forEach((item) => {
    if (item[children]?.length) {
      item[children] = sortTree(item[children], sortFn, config)
    }
  })
  return tree
}

// 转换树结构
export function mapTree<T = any, R = T>(
  tree: T[],
  mapFn: (node: T) => R,
  config: Partial<TreeHelperConfig> = {},
): R[] {
  const { children } = getConfig(config)
  return tree.map((item) => {
    const newItem: R = mapFn(item)
    if (item[children]?.length) {
      newItem[children] = mapTree(item[children], mapFn, config)
    }
    return newItem
  })
}
