import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("design-docs-sidebar")
export class SideBarElement extends LitElement {
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
  logoSrc = "";

  static styles = css`
    header {
      font-size: var(--sidebar-header-font-size, 1.25rem);
    }
    img {
      width: var(--side-bar-header-font-size, 1.25rem);
      margin-right: 0.25em;
    }
  `;

  render() {
    return html`<header><img src="${this.logoSrc}" /><slot></slot></header>`;
  }
}
