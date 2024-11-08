// page.js
'use client';
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Map = dynamic(() => import("./components/Map"), { 
  loading: () => <p>A map is loading...</p>,
  ssr: false // Avoid server-side rendering
});

export default function Home() {
  const MemoizedMap = useMemo(() => <Map />, []);

  return (
    <div>
      <div className={styles.container} style={{
        backgroundImage: "url('/banner.jpg')",
      }}>
        <nav className={styles.navigation}>
          <img src="/Avicol.png" alt="logo" style={{width: '240px', cursor: 'pointer'}}/>
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="/">Home</a></li>
            <li className={styles.navItem}><a href="/about">About</a></li>
            <li className={styles.navItem}><a href="/birds">Birds</a></li>
            <li className={styles.navItem}><a href="/contact">Contact</a></li>
            <li className={styles.navItem}><a href="/contact">Insights</a></li>
          </ul>
        </nav>

        {/* Page Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span >Interactive Map</span> of <span className={styles.birds}>Birds</span> in <span className={styles.colombia}>Colombia</span>
          </h1>
          <p className={styles.description}>
            Explore the distribution of bird sightings across Colombia and discover the incredible biodiversity of our country.
          </p>
          <button type="submit" className={styles.button}>Explore the map</button>
        </div>
      </div>

      <div className={styles.mapSection}>
        <h2 className={styles.mapTitle}>Bird Distribution in Colombia</h2>
        <p className={styles.mapDescription}>
          Explore the different bird species in Colombia and discover their habitats across the country. 
          Click on the points on the map for more information!
        </p>
        <div className={styles.mapContainer}>
          {MemoizedMap}
        </div>
      </div>
    </div>
  );
}
