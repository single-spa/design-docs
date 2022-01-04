import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("design-docs-sidebar")
export class SideBarElement extends LitElement {
  static styles = css`
    :host {
      box-shadow: 1px 0 var(--dd-sidebar-padding, 4px) rgba(0, 0, 0, 0.25);
      display: flex;
    }
    ::slotted(design-docs-sidenav) {
      flex: 1;
    }
    aside {
      display: flex;
      flex-direction: column;
    }
  `;
  render() {
    return html`<aside>
      <slot name="header"></slot>
      <slot name="content"></slot>
    </aside>`;
  }
}

@customElement("design-docs-sidebar-header")
export class SideBarHeaderElement extends LitElement {
  @property()
  logoSrc = new URL("/static/logo.svg", window.designDocsBaseUrl).href;

  static styles = css`
    :host {
      margin: var(--dd-sidebar-padding);
      display: block;
    }
    header {
      font-size: var(--dd-sidebar-header-font-size);
      font-family: var(--dd-sidebar-header-font);
    }
    img {
      vertical-align: text-top;
      height: var(--dd-sidebar-header-font-size);
      margin-right: 0.25em;
    }
  `;

  render() {
    return html`<header><img src="${this.logoSrc}" /><slot></slot></header>`;
  }
}
