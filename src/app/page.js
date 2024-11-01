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
        backgroundImage: " linear-gradient(rgba(9,0,77, 0.65), rgba(9,0,77,0.65)), url('/vividly-colored-hummingbird-nature.jpg')"
      }}>
        <nav className={styles.navigation}>
          {/* <div className={styles.logo}>
            <img src="/logo.png" alt="logo" />
          </div>*/}
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="/">Home</a></li>
            <li className={styles.navItem}><a href="/about">About</a></li>
            <li className={styles.navItem}><a href="/birds">Birds</a></li>
            <li className={styles.navItem}><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        {/* Page Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>AVICOL: Mapa Interactivo de Aves en Colombia</h1>
          <p className={styles.description}>
            Explora la distribución de avistamientos de aves a lo largo de Colombia y descubre la increíble biodiversidad de nuestro país.
          </p>

          <button type="submit" className={styles.button}>Explorar el mapa</button>
        
        </div>
      </div>

      {/* Map */}
      {MemoizedMap}
      
    </div>
  );
}
