'use client';
import { useState, useEffect } from 'react';
import styles from './../page.module.css';
import styles2 from './page.module.css';
import Link from 'next/link';

export default function Birds() {
  const [birdsData, setBirdsData] = useState([]);
  const [filteredBirds, setFilteredBirds] = useState([]);
  const [filter, setFilter] = useState({
    kingdom: ['Animalia'], // Pre-set and fixed for this category
    phylum: ['Chordata'],  // Pre-set and fixed for this category
    order: [],
    family: [],
    genus: []
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetch('/birds_catalogue.json')
      .then(response => response.json())
      .then(data => {
        setBirdsData(data);
        setFilteredBirds(data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching birds:', error);
        setLoading(false); // Even if there's an error, stop the loading state
      });
  }, []);

  useEffect(() => {
    const hasActiveFilters = Object.values(filter).some(value => value.length > 0);

    if (hasActiveFilters) {
      const filtered = birdsData.filter(bird =>
        (filter.kingdom.length > 0 ? filter.kingdom.includes(bird.kingdom) : true) &&
        (filter.phylum.length > 0 ? filter.phylum.includes(bird.phylum) : true) &&
        (filter.order.length > 0 ? filter.order.includes(bird.order) : true) &&
        (filter.family.length > 0 ? filter.family.includes(bird.family) : true) &&
        (filter.genus.length > 0 ? filter.genus.includes(bird.genus) : true)
      );
      setFilteredBirds(filtered);
    } else {
      setFilteredBirds(birdsData); // Reset to show all birds if no filters are applied
    }
  }, [filter, birdsData]);

  const handleFilterChange = (category, value) => {
    setFilter(prevFilter => {
      const updatedCategory = prevFilter[category].includes(value)
        ? prevFilter[category].filter(item => item !== value)
        : [...prevFilter[category], value];
      return { ...prevFilter, [category]: updatedCategory };
    });
  };

  const uniqueValues = (category) => {
    return [...new Set(birdsData.map(bird => bird[category]))].filter(Boolean);
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9' }}>
      {/* Navigation Bar */}
      <div className={styles2.navContainer}>
        <nav className={styles2.navigation}>
          <Link href="/">
            <img src="/Avicol.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
          </Link>
          <ul className={styles2.navList}>
            <li className={styles2.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles2.navItem}>
              <Link href="/about">About</Link>
            </li>
            <li className={styles2.navItem}>
              <Link href="/birds">Birds</Link>
            </li>
            <li className={styles2.navItem}>
              <Link href="/dashboard">Insights</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles2.container}>

        <div className={styles2.descriptionContainer}>
          <div className={styles2.textColumn}>
            <h1 className={styles2.title}>
              <span className={styles2.dataset}>Explore Bird Observations in Colombia</span>
            </h1>
            <p>
              Discover and visualize detailed records of bird observations across Colombia. This dataset includes <strong>413,272 sightings</strong> from <strong>1948 to 2011</strong>, documenting <strong>203 bird species</strong> from diverse regions, with detailed taxonomic and distribution data.
            </p>
          </div>

          <div className={styles2.infoColumn}>
            <h3 className={styles2.dataset}>Dataset Information</h3>
            <p>
              Collected by the Sociedad Antioqueña de Ornitología (SAO) and managed by the Red Nacional de Observadores de Aves (RNOA).
            </p>
            <p>
              Hosted by the Sistema de Información sobre Biodiversidad de Colombia (SiB), with open access under a <Link href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0 license</Link>.
            </p>
            <small>Published: January 21, 2022 | Updated: June 22, 2023</small>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className={styles2.loadingContainer}>
            <p>Loading data, please wait...</p>
          </div>
        ) : (
          <div className={styles2.mainContent}>
            {/* Filter Panel */}
            <aside className={styles2.filterPanel}>
              <h3>Filter by Classification</h3>
              {['kingdom', 'phylum', 'order', 'family', 'genus'].map((category) => (
                <div key={category} className={styles2.filterGroup}>
                  <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                  <div className={styles2.dropdown}>
                    {uniqueValues(category).map((value) => (
                      <div key={value} className={styles2.checkboxItem}>
                        <input className={styles2.checkbox}
                          type="checkbox"
                          checked={filter[category].includes(value)}
                          onChange={() => handleFilterChange(category, value)}
                          disabled={category === 'kingdom' || category === 'phylum'}
                        />
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Birds List */}
            <section className={styles2.birdList}>
              {filteredBirds.map((bird) => (
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
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        Red Nacional de Observadores de Aves, Naranjo Maury G (2022). DATAVES. Version 7.5. Red Nacional de Observadores de Aves - RNOA. Occurrence dataset. <Link href="https://doi.org/10.15472/iqnpse" target="_blank" rel="noopener noreferrer">https://doi.org/10.15472/iqnpse</Link>, accessed via GBIF.org on 2024-11-11.
      </footer>
    </div>
  );
}
