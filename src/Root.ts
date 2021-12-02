import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("design-docs-root")
export class RootElement extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: row;
    }
  `;

  render() {
    return html`
      <slot name="sidebar"></slot>
      <slot name="content"></slot>
    `;
  }
}
