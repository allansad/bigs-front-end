"use client";

import { observer } from "mobx-react-lite";
import { userStore } from "@/stores/userStore";
import styles from "@/styles/header.module.scss";

const Header = observer(() => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.navList}>
          <li>
            <a href="/">홈</a>
          </li>
        </ul>
      </nav>
      {userStore.emailPrefix && (
        <div className={styles.userInfo}>
          <p>{userStore.emailPrefix}님, 안녕하세요!</p>
        </div>
      )}
    </header>
  );
});

export default Header;
