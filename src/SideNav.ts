import { LitElement, css, html, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import {
  RouteTreeItem,
  RouteTree,
  RouteTreeItemType,
  Route,
  Routes,
  resolveRouteStructure,
} from "./Routes";

/**
 * Renders sidenav tree based on route information.
 *
 * Note: Subtree expansion state will be lost on re-render, consider storing it internally
 */
@customElement("design-docs-sidenav")
export class SideNavElement extends LitElement {
  /**
   * Flat array of routes
   */
  @property({ attribute: false, type: Array })
  routes: Routes = [];

  /**
   * Tree-structured array of routes, generated when routes prop changes
   */
  @state()
  routeTree: RouteTree = [];

  @property({ attribute: true, type: Boolean })
  searchable = false;

  /** Active search string */
  @state() searchString = "";

  static styles = css`
    :host {
      font-family: var(--dd-sidenav-font);
      display: flex;
      flex-direction: column;
    }
    nav {
      flex: 1;
      overflow-y: auto;
    }
    ul {
      margin-block-start: var(--dd-sidenav-item-spacing, 0.25em);
      margin-block-end: var(--dd-sidenav-item-spacing, 0.25em);
      padding-inline-start: 1em;
    }
    li:not(:first-child) {
      margin-top: var(--dd-sidenav-item-spacing, 0.25em);
    }
    li:not(:last-child) {
      margin-bottom: var(--dd-sidenav-item-spacing, 0.25em);
    }
    .hidden {
      display: none;
    }
    ul[role="group"] {
      padding-inline-start: var(--dd-sidenav-group-indent, 1.25em);
    }
    li[aria-expanded="false"].expandable > ul {
      display: none;
    }
    li {
      list-style-type: none;
    }
    .group-label {
      cursor: pointer;
    }
    a {
      text-decoration: none;
      color: black;
    }
    .icon {
      width: 1em;
      height: 1em;
      vertical-align: top;
    }
  `;

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has("routes")) {
      // Update routes tree when routes changes
      this.routeTree = resolveRouteStructure(this.routes);
    }
  }

  // #region [Render Methods]
  render() {
    const searchClasses = { hidden: !this.searchable };
    return html` <design-docs-sidenav-search
        @search=${this.onSearch}
        class=${classMap(searchClasses)}
      ></design-docs-sidenav-search>
      <nav>
        <ul role="tree">
          ${this.routeTree.map((item) => this.renderTreeItem(item))}
        </ul>
      </nav>`;
  }

  renderTreeItem(treeItem: RouteTreeItem) {
    if (treeItem.type === RouteTreeItemType.GROUP) {
      return html`<li role="treeitem" class="expandable" aria-expanded="false">
        ${this.renderGroupIcon()}
        <span
          class="group-label"
          tabindex="0"
          @click="${this.onTreeGroupClick}"
          @keydown="${this.onTreeGroupKeyDown}"
          >${treeItem.label}</span
        >
        <ul role="group">
          ${treeItem.children.map((item) => this.renderTreeItem(item))}
        </ul>
      </li> `;
    } else {
      const route: Route = this.routes[treeItem.index];
      if (this.itemHiddenForSearch(route)) {
        // Hide if outside search
        return null;
      }
      return html`<li role="treeitem">
        ${this.renderRouteIcon()}
        <a href="${route.path}">${route.label}</a>
      </li>`;
    }
  }

  // TODO: Consider moving into SVG file
  private renderRouteIcon() {
    return svg`<svg class="icon" viewBox="0 0 196 196" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(44.000000, 32.000000)" stroke="#000000">
            <path d="M82.7871267,2 L107,26.1011169 L107,131 L2,131 L2,2 L82.7871267,2 Z" id="Path" stroke-width="4"></path>
            <polyline id="Path-2" stroke-width="4" points="82 0 82 27 108 27"></polyline>
            <line x1="10.3503937" y1="37.5" x2="98.6496063" y2="37.5" id="Line" stroke-width="3" stroke-linecap="square"></line>
            <line x1="10.3503937" y1="94.5" x2="98.6496063" y2="94.5" id="Line" stroke-width="3" stroke-linecap="square"></line>
            <line x1="10.3503937" y1="66.5" x2="98.6496063" y2="66.5" id="Line" stroke-width="3" stroke-linecap="square"></line>
            <line x1="20.35" y1="51.5" x2="89.65" y2="51.5" id="Line" stroke-width="3" stroke-linecap="square"></line>
            <line x1="20.35" y1="80.5" x2="89.65" y2="80.5" id="Line" stroke-width="3" stroke-linecap="square"></line>
            <line x1="19" y1="108.25" x2="89" y2="108.75" id="Line" stroke-width="3" stroke-linecap="square"></line>
        </g>
    </g>
  </svg>`;
  }

  // TODO: Consider moving into SVG file
  private renderGroupIcon() {
    return svg`<svg class="icon" viewBox="0 0 196 196" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g transform="translate(9.000000, 34.000000)" stroke="#000000" stroke-width="4">
        <rect id="Rectangle" x="0" y="18" width="178" height="109" rx="8"></rect>
        <path d="M164,0 C168.418278,0 172,3.581722 172,8 L172.000358,12.2521271 C175.450631,13.1403373 178,16.2724501 178,20 L178,119 C178,123.418278 174.418278,127 170,127 L8,127 C3.581722,127 5.68434189e-14,123.418278 5.68434189e-14,119 L5.68434189e-14,20 C5.68434189e-14,15.581722 3.581722,12 8,12 L93,12 L93,8 C93,3.581722 96.581722,0 101,0 L164,0 Z" id="Path"></path>
    </g>
  </g>
</svg>`;
  }
  // #endregion

  private itemHiddenForSearch(route: Route): boolean {
    if (this.searchable && this.searchString) {
      return !route.label?.includes(this.searchString);
    }
    return false;
  }

  private onSearch(event: SideNavSearchSearchEvent): void {
    this.searchString = event.detail;
  }

  private onTreeGroupKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      const el = (event.target as HTMLSpanElement).parentElement;
      this.treeGroupToggle(el);
    }
  }

  private onTreeGroupClick(event: PointerEvent): void {
    const el = (event.target as HTMLSpanElement).parentElement;
    this.treeGroupToggle(el);
  }

  private treeGroupToggle(el: HTMLElement | null): void {
    if (el && el?.ariaExpanded === "true") {
      el.ariaExpanded = "false";
    } else {
      el?.setAttribute("aria-expanded", "true");
    }
  }
}

/**
 * Basic sidenav header with search
 */
@customElement("design-docs-sidenav-search")
export class SideNavSearchElement extends LitElement {
  /** Search input placeholder text */
  @property() placeholder = "Search";

  static styles = css`
    :host {
      font-family: var(--dd-sidenav-font);
      display: flex;
      padding: var(--dd-sidenav-item-spacing, 0.25em);
      background-color: var(--dd-sidenav-accent-color, silver);
    }
    input {
      flex: 1;
    }
  `;

  render() {
    return html`<input
      type="search"
      placeholder="${this.placeholder}"
      @input=${this.onSearchChange}
    />`;
  }

  private onSearchChange(event: InputEvent): void {
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: (event.target as HTMLInputElement).value,
        composed: true,
      })
    );
  }
}

export type SideNavSearchSearchEvent = CustomEvent<string>;
