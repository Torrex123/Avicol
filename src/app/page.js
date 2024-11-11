'use client';
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect, useRef } from "react";
import styles2 from "./birds/page.module.css";

const Map = dynamic(() => import("./components/Map"), {
  loading: () => <p>A map is loading...</p>,
  ssr: false
});

export default function Home() {
  const [selectedBirds, setSelectedBirds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bird data
  const [birdsData, setBirdsData] = useState([]);
  useEffect(() => {
    fetch('/birds_catalogue.json')
      .then(response => response.json())
      .then(data => {
        setBirdsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching birds:', error);
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (markerData) => {
    const speciesSet = new Set();
    markerData.species.forEach(species => {
      console.log('species:', species);
      birdsData.forEach(bird => {
        if (bird.scientificName === species) {
          speciesSet.add(bird);
        }
      });
    });

    console.log('Selected birds:', Array.from(speciesSet));
    setSelectedBirds(Array.from(speciesSet));
  };

  const MemoizedMap = useMemo(() => <Map onMarkerClick={handleMarkerClick} />, [birdsData]);

  const mapRef = useRef(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className={styles.container} style={{
        backgroundImage: "url('/banner.jpg')",
      }}>
        <nav className={styles.navigation}>
          <img src="/Avicol.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="/">Home</a></li>
            <li className={styles.navItem}><a href="/about">About</a></li>
            <li className={styles.navItem}><a href="/birds">Birds</a></li>
            <li className={styles.navItem}><a href="/dashboard">Insights</a></li>
          </ul>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>
            Interactive Map of <span className={styles.birds}>Birds</span> in <span className={styles.colombia}>Colombia</span>
          </h1>
          <p className={styles.description}>
            Explore the distribution of bird sightings across Colombia and discover the incredible biodiversity of our country.
          </p>
          <div className={styles.button_container}>
            <button type="button" className={styles.button} onClick={scrollToMap}>Explore the map</button>
          </div>
        </div>
      </div>
      
      <div className={styles.mapSection} ref={mapRef}>
        <h2 className={styles.mapTitle}>Bird Distribution in Colombia</h2>
        <p className={styles.mapDescription}>
          Explore the different bird species in Colombia and discover their habitats across the country.
        </p>

        <div className={styles.wrapper}>
          
          <div className={styles.mapinfo}> 
            <div className={styles.information}>
              <h3>Information</h3>
              <p>
                Colombia is the country with the most bird species in the world, with over 1,900 species.
                This is due to its diverse ecosystems, which include the Andes mountains, the Amazon rainforest,
                and the Caribbean coast. Colombia is home to many endemic species, which can only be found in the country.
              </p>
              <h3>Want to know some insights?</h3>
              <p>
                Click on the insights button to see some interesting facts about the bird species in Colombia.
              </p>
              <button type="submit" className={styles.button}>Insights</button>
            </div>

            <div className={styles.information}>
              <h3>Click on the Markers!</h3>
              <p>
              Click on the markers on the map for more information!
              </p>
              <img src="/markers.png" alt="logo" style={{ width: '50px', cursor: 'pointer' }} />

            </div>

          </div>

          <div className={styles.mapContainer}>
            {MemoizedMap}
          </div>
        </div>
      </div>

      {/* Bird Information Section */}
      <div className={styles.birdInfoSection}>
        {loading ? (
          <p>Loading data, please wait...</p>
        ) : selectedBirds.length > 0 ? (
          <section className={styles2.birdList}>
            {selectedBirds.map((bird) => (
              <div key={bird.scientificName} className={styles2.birdCard}>
                <img src={bird.image_url} alt={bird.scientificName} className={styles2.birdImage} />
                <h4>{bird.scientificName}</h4>
                <p><strong>Kingdom:</strong> {bird.kingdom}</p>
                <p><strong>Phylum:</strong> {bird.phylum}</p>
                <p><strong>Order:</strong> {bird.order}</p>
                <p><strong>Family:</strong> {bird.family}</p>
                <p><strong>Genus:</strong> {bird.genus}</p>
              </div>
            ))}
          </section>
        ) : (
          <p>No birds selected. Click on a map marker to see bird details.</p>
        )}
      </div>
    </div>
  );
}
