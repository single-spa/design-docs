# component-library

```jsx
import {
  Documentation,
  SideNav,
  SideNavMenuItem,
  TopNav,
  Content,
  Sandbox,
} from "ourlib";

export const MyStory = () => <Button />;

export default function WalmartDocumentation(props) {
  return (
    <>
      <SideNav>
        <SideNavMenuItem />
      </SideNav>
      <TopNav />
      <Content>
        <Sandbox component={Button} />
        <div>Primary button</div>
        <Button variant="primary" />
        <div>Secondary button</div>
        <Button variant="secondary" />
      </Content>
    </>
  );
}

function Button(props: ButtonProps) {}

interface ButtonProps {
  variant: string;
}
```
