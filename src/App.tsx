import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";
import { Outlet } from "react-router-dom";
import image from "@/assets/image.png";
import Icon from "@/assets/icon.svg";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  console.log(__ENV_VAR__); // глобальная переменная

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className={styles.container}>
      <Header />
      <Icon stroke="red" />
      <img src={image} height={100} width={100} alt="image" />
      <h1 className={styles.title}>App</h1>
      <button onClick={handleClick}>Click me</button>
      <h2>Count: {count}</h2>
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
