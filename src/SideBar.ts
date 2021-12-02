import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("design-docs-sidebar")
export class SideBarElement extends LitElement {
  static styles = css`
    :host {
      box-shadow: 1px 0 var(--sidebar-padding, 4px) rgba(0, 0, 0, 0.25);
    }
    aside {
      padding: var(--sidebar-padding);
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
  logoSrc = "";

  static styles = css`
    :host {
      margin: var(--sidebar-padding) 0;
    }
    header {
      font-size: var(--sidebar-header-font-size);
      font-family: var(--sidebar-header-font);
    }
    img {
      width: var(--sidebar-header-font-size);
      margin-right: 0.25em;
    }
  `;

  render() {
    return html`<header><img src="${this.logoSrc}" /><slot></slot></header>`;
  }
}
