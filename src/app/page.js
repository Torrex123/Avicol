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
  // Memoize the Map component to prevent unnecessary re-renders
  const MemoizedMap = useMemo(() => <Map />, []);

  return (
    <div className={styles.page}>
      <div className={styles.map}>
        {MemoizedMap}
      </div>
    </div>
  );
}
