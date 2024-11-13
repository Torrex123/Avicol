'use client'
import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import("./components/Map"), {
  loading: () => <p>A map is loading...</p>,
  ssr: false,
});


export default function Home() {
  const router = useRouter();
  const [selectedBirds, setSelectedBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [birdsData, setBirdsData] = useState([]);
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');
  
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

  const birdRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedBirds.length > 0 && birdRef.current) {
      birdRef.current.scrollIntoView();
    }
  }, [selectedBirds]);

  const handleMarkerClick = (markerData) => {

    const speciesSet = new Set();
    const [Latitude, Longitude] = markerData.location.split(',').map(Number);
    setLatitude(Latitude);
    setLongitude(Longitude);

    markerData.species.forEach(species => {
      birdsData.forEach(bird => {
        if (bird.scientificName === species) {
          speciesSet.add(bird);
        }
      });
    });
    setSelectedBirds(Array.from(speciesSet));
  };

  const MemoizedMap = useMemo(() => <Map onMarkerClick={handleMarkerClick} />, [birdsData]);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const redirectToBirds = () => {
    router.push('/birds');
  };

  const redirectToInsights = () => {
    router.push('/dashboard');
  }

  const redirectToAbout = () => {
    router.push('/about');
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div className={styles.container} style={{ backgroundImage: "url('/banner.jpg')" }}>
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
              <button type="submit" className={styles.button} onClick={redirectToInsights}>Insights</button>
            </div>

            <div className={styles.information}>
              <h3>Click on the Markers!</h3>
              <p>Click on the markers on the map for more information!</p>
              <img src="/markers.png" alt="logo" style={{ width: '50px', cursor: 'pointer' }} />
            </div>
          </div>

          <div className={styles.mapContainer}>
            {MemoizedMap}
          </div>
        </div>
      </div>

      {/* Bird Information Section */}
      <div className={styles.birdmapsection} ref={birdRef}>
        {selectedBirds.length > 0 && (
          <>
            <h2 className={styles.mapTitle}>Birds sighted at the Marker</h2>
            <p className={styles.mapDescription}></p>
            <div className={styles.birdInfoWrapper}>
              <div className={styles.additionalInfo}>
                <div className={styles.markersInfo}>
                  <h2>Coordinates</h2>
                  <p>Latitude: {Latitude}, Longitude: {Longitude}</p>
                </div>
                <div className={styles.markersInfo}>
                  <h2>Want to know the Bird Catalogue?</h2>
                  <p>Click on the Birds button to see the complete bird catalogue.</p>
                  <button type="submit" className={styles.button} onClick={redirectToBirds}>Birds</button>
                </div>
                <div className={styles.markersInfo}>
                  <h2>Know more about the project!</h2>
                  <p>Click here and access more information</p>
                  <button type="submit" className={styles.button} onClick={redirectToAbout}>About</button>
                </div>
              </div>

              <div className={styles.birdInfoSection}>
                {loading ? (
                  <p>Loading data, please wait...</p>
                ) : selectedBirds.length > 0 ? (
                  <section className={styles.birdList}>
                    {selectedBirds.map((bird) => (
                      <div key={bird.scientificName} className={styles.birdCard}>
                        <img src={bird.image_url} alt={bird.scientificName} className={styles.birdImage} />
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
          </>
        )}
      </div>

      {/* Footer Section */}
      <footer className={styles.footer}>
        Red Nacional de Observadores de Aves, Naranjo Maury G (2022). DATAVES. Version 7.5. Red Nacional de Observadores de Aves - RNOA. Occurrence dataset. <a href="https://doi.org/10.15472/iqnpse" target="_blank" rel="noopener noreferrer">https://doi.org/10.15472/iqnpse</a>, accessed via GBIF.org on 2024-11-11.
      </footer>
    </div>
  );
}
