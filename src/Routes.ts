/**
 * React Component, Vue Component, Angular Module, or HTML String
 * Also support function returning promise that resolves to one of the above
 */
export type ComponentReference = unknown;

export enum RouteFramework {
  VUE = "vue",
  REACT = "react",
  ANGULAR = "angular",
  HTML = "html",
}

export const RouteGroupDelimiter = "/";

/**
 * Individual route for a navigation item
 */
export interface Route {
  label: string;
  path: string;
  group?: string;
  component?: ComponentReference | (() => Promise<ComponentReference>);
  framework?: RouteFramework;
}

/** Collection of Routes */
export type Routes = Route[];

// #region [Route Tree Parsing]
export enum RouteTreeItemType {
  GROUP = "group",
  ROUTE = "route",
}

export interface RouteTreeItem {
  type: RouteTreeItemType;
  // index of route in Routes if this is a route; default to -1 for group?
  index: number;
  // label (for group)
  label?: string;
  children?: RouteTreeItem[];
}

export type RouteTree = RouteTreeItem[];

/**
 * Constructs a tree from routing information for use by navigation component
 * @param routes Routing information
 * @returns Structured route navigation tree
 * @example
 * const input = [
        {lbel: 'Intro', path: 'intro'},
        {label: 'Push Button', group: 'Inputs/Buttons', path: 'push-button'},
        {label: 'Reset Button', group: 'Inputs/Buttons', path: 'reset-button'}
    ];
 
    const output = [
        { type: 'route', index: 0 },
        { type: 'group', label: 'Inputs', children: [
            { type: 'group', label: 'Buttons', children: [
                { type: 'route': index: 1 },
                { type: 'route': index: 2 }
            ]}
        ]}
    ];
 */
export const resolveRouteStructure = (routes: Routes): RouteTree => {
  const tree: RouteTree = [];
  const groupRefMap: Record<string, RouteTreeItem> = {};

  const traceGroupRef = (groupName: string): RouteTreeItem[] => {
    const groupPath = groupName.split(RouteGroupDelimiter);
    const refs: RouteTreeItem[] = [];
    for (let i = 0; i < groupPath.length; i++) {
      const ref =
        groupRefMap[groupPath.slice(0, i + 1).join(RouteGroupDelimiter)];
      if (ref) {
        refs.push(ref);
      } else {
        break;
      }
    }
    return refs;
  };

  const buildGroups = (groupName: string): RouteTreeItem => {
    const refs = traceGroupRef(groupName);
    const groupPath = groupName.split(RouteGroupDelimiter).slice(refs.length);
    let group: RouteTreeItem = {
      index: -1,
      type: RouteTreeItemType.GROUP,
      label: "",
      children: [],
    };
    let parent = refs[refs.length - 1];
    const groupPrefix = refs.length
      ? `${groupName
          .split(RouteGroupDelimiter)
          .slice(0, refs.length)
          .join(RouteGroupDelimiter)}${RouteGroupDelimiter}`
      : "";
    for (let i = 0; i < groupPath.length; i++) {
      group = {
        ...group,
        label: groupPath[i],
      };
      const name = groupPrefix.concat(
        groupPath.slice(0, i + 1).join(RouteGroupDelimiter)
      );
      groupRefMap[name] = group;
      if (parent) {
        parent.children?.push(group);
      } else {
        tree.push(group);
      }
      parent = group;
    }
    return group;
  };

  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];
    if (route.group) {
      let groupRef = groupRefMap[route.group];
      if (!groupRef) {
        groupRef = buildGroups(route.group);
      }
      groupRef.children?.push({
        index,
        type: RouteTreeItemType.ROUTE,
      });
    } else {
      tree.push({
        index,
        type: RouteTreeItemType.ROUTE,
      });
    }
  }

  return tree;
};
// #endregion
