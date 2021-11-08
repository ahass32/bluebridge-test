import "./App.css";
import { Flex } from "@chakra-ui/react";
import { LoginForm } from "./Login";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Flex flexDir="column" justify="center" align="center" h="100vh">
        <img src={logo} className="App-logo" alt="logo" />
        <LoginForm />
      </Flex>
    </div>
  );
}

export default App;
