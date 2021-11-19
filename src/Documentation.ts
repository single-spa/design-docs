import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("design-doc-documentation")
class Documentation extends LitElement {
  render() {
    const name = "Wade";
    return html`<p>Hello ${name}</p>`;
  }
}
