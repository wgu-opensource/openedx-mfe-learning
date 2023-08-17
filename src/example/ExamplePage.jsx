import { Container } from "@edx/paragon";
import { CompleteIcon } from "@edx/frontend-app-learning";
import { Sequence } from "@edx/frontend-app-learning/src/exports";

const ExamplePage = () => (
  <main>
    <Container className="py-5">
      <h1>Example Page</h1>
      <p>Hello world!</p>
      <CompleteIcon></CompleteIcon>
      <Sequence></Sequence>
    </Container>
  </main>
);

export default ExamplePage;
