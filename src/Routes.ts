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

export type RouteTreeItem = RouteTreeGroup | RouteTreeRoute;
export interface RouteTreeGroup {
  type: RouteTreeItemType.GROUP;
  label: string;
  children: RouteTreeItem[];
}
export interface RouteTreeRoute {
  type: RouteTreeItemType.ROUTE;
  // index of route in Routes if this is a route; default to -1 for group?
  index: number;
}

export type RouteTree = RouteTreeItem[];

/**
 * Constructs a tree from routing information for use by navigation component
 * @param routes Routing information
 * @returns Structured route navigation tree
 * @example
 * const input = [
        {label: 'Intro', path: 'intro'},
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

  /**
   * Trace group references to deepest that exists
   * @param groupName Group name path to trace
   * @returns Array of existing group references
   */
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

  /**
   * Constructs any groups not already created in groupName path and returns the deepest
   * @param groupName Group name from route
   * @returns Deepest group reference
   */
  const buildGroups = (groupName: string): RouteTreeItem => {
    const groupRefs = traceGroupRef(groupName);
    /** template group tree item */
    let group: RouteTreeGroup = {
      type: RouteTreeItemType.GROUP,
      label: "",
      children: [],
    };
    // Set initial parent group to deepest existing, if any
    let parentGroup = groupRefs[groupRefs.length - 1];
    const path = groupName.split(RouteGroupDelimiter);
    /** Prefix for group names that will be constructed, containing delimited list of any existing group names */
    const groupPrefix = groupRefs.length
      ? `${path
          .slice(0, groupRefs.length)
          .join(RouteGroupDelimiter)}${RouteGroupDelimiter}`
      : "";
    /** Names of groups that need to be created */
    const pathSteps = path.slice(groupRefs.length);

    // at this point, pathSteps will consist only of groups that need to be created,
    // since existing groups found and stored in groupRefs have been sliced off
    // the start of the path
    for (let stepIdx = 0; stepIdx < pathSteps.length; stepIdx++) {
      group = { ...group, label: pathSteps[stepIdx], children: [] };
      /** Name of the group being constructed, with prefix + any previous
       * group names created in prior iterations */
      const name = groupPrefix.concat(
        pathSteps.slice(0, stepIdx + 1).join(RouteGroupDelimiter)
      );
      groupRefMap[name] = group;
      if (parentGroup) {
        // We have a parent group, so this isn't a root level group
        // Add new group to parent
        (parentGroup as RouteTreeGroup).children.push(group);
      } else {
        // Adding to tree root
        tree.push(group);
      }
      // new group becomes parent
      parentGroup = group;
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
      (groupRef as RouteTreeGroup).children.push({
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
