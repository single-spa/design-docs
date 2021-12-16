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

export const resolveRouteStructure = (routes: Routes): RouteTree => {
  // TODO: Have this build out a route tree e.g.:
  /*
    Input: [
        {label: 'Intro', path: 'intro'},
        {label: 'Push Button', group: 'Inputs/Buttons', path: 'push-button'},
        {label: 'Reset Button', group: 'Inputs/Buttons', path: 'reset-button'}
    ]

    Output: [
        { type: 'route', index: 0 },
        { type: 'group', label: 'Inputs', children: [
            { type: 'group', label: 'Buttons', children: [
                { type: 'route': index: 1 },
                { type: 'route': index: 2 }
            ]}
        ]}
    ]
   
    */
  return [];
};
// #endregion
