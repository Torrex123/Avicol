// page.js
import styles from "./../page.module.css";
import styles2 from "./page.module.css";
import Image from 'next/image';

export default function Dashboard() {

  return (
    <div className={styles2.container}>
      {/* Navigation Bar */}
      <nav className={styles.navigation}>
        <Image src="/Avicol.png" alt="logo" width={240} height={240} style={{ cursor: 'pointer' }} />
        <ul className={styles.navList}>
          <li className={styles2.navItem}><a href="">Home</a></li>
          <li className={styles2.navItem}><a href="/about">About</a></li>
          <li className={styles2.navItem}><a href="/birds">Birds</a></li>
          <li className={styles2.navItem}><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      {/* Title Section for Insights */}
      <div className={styles2.insightsTitleSection}>
        <h1 className={styles2.title}>
          <span>Explore</span> Valuable <span className={styles2.insights}>Insights</span> on <span className={styles2.birds}>Bird Populations</span>
        </h1>
        <p className={styles2.description}>
          Dive into data-driven insights to understand bird distribution, habitat preferences, and seasonal sightings across Colombia.
        </p>
      </div>
    </div>
  );
}
