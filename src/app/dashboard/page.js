'use client';
import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from "./../page.module.css";
import styles2 from "./page.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [yearlyObservations, setYearlyObservations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topBirds, setTopBirds] = useState([]);

  useEffect(() => {
    fetch('/yearly_observations.json')
      .then(response => response.json())
      .then(data => setYearlyObservations(data))
      .catch(error => console.error('Error fetching yearly observations:', error));
  }, []);

  useEffect(() => {
    fetch('/top_locations.json')
      .then(response => response.json())
      .then(data => setTopLocations(data))
      .catch(error => console.error('Error fetching top locations:', error));
  }, []);

  useEffect(() => {
    fetch('/top_10_birds_observation.json')
      .then(response => response.json())
      .then(data => setTopBirds(data))
      .catch(error => console.error('Error fetching top birds:', error));
  }, []);

  // Chart Data and Options
  const yearlyObservationsData = {
    labels: yearlyObservations.map(entry => entry.year),
    datasets: [
      {
        label: 'Bird Observations per Year',
        data: yearlyObservations.map(entry => entry.count),
        fill: false,
        borderColor: 'rgba(34, 139, 34, 0.6)',
        backgroundColor: 'rgba(34, 139, 34, 0.4)',
      },
    ],
  };

  const topLocationsData = {
    labels: topLocations.map(entry => entry.location),
    datasets: [
      {
        label: 'Top Locations by Observation Count',
        data: topLocations.map(entry => entry.count),
        backgroundColor: 'rgba(60, 179, 113, 0.6)',
      },
    ],
  };

  const topBirdsData = {
    labels: topBirds.map(entry => entry.scientificName),
    datasets: [
      {
        label: 'Top 10 Birds Observed',
        data: topBirds.map(entry => entry.count),
        backgroundColor: [
          '#228B22', '#32CD32', '#98FB98', '#00FA9A', '#00FF7F',
          '#66CDAA', '#8FBC8F', '#2E8B57', '#3CB371', '#20B2AA'
        ],
      },
    ],
  };

  return (
      <div>
        {/* Navigation Bar */}
        <div className={styles2.navContainer}>
          <nav className={styles2.navigation}>
            <img src="/Avicol.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
            <ul className={styles.navList}>
              <li className={styles2.navItem}><a href="/">Home</a></li>
              <li className={styles2.navItem}><a href="/about">About</a></li>
              <li className={styles2.navItem}><a href="/birds">Birds</a></li>
              <li className={styles2.navItem}><a href="/dashboard">Insights</a></li>
            </ul>
          </nav>
        </div>
  
        {/* Enhanced Title Section */}
        <div className={styles2.container}>
          <div className={styles2.insightsTitleSection}>
            <h1 className={styles2.title}>Explore Vital Insights on Colombian Bird Populations</h1>
            <p className={styles2.description}>
              Discover a wealth of data on bird distribution across Colombia, compiled from over half a century of observations. Analyze key regions, species prevalence, and seasonal trends to understand bird population dynamics in diverse Colombian habitats.
            </p>
          </div>
        </div>
  
        {/* Dashboard Layout */}
        <div className={styles2.dashboardGrid}>
          <div className={styles2.chartContainer}>
            <h2>Bird Observations Over the Years</h2>
            <Line data={yearlyObservationsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          
          <div className={styles2.chartContainer}>
            <h2>Top Observation Locations</h2>
            <Bar data={topLocationsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
  
          <div className={styles2.chartContainer}>
            <h2>Top 10 Birds Observed</h2>
            <Pie data={topBirdsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
  
        {/* Footer Section */}
        <footer className={styles.footer}>
          Red Nacional de Observadores de Aves, Naranjo Maury G (2022). DATAVES. Version 7.5. Red Nacional de Observadores de Aves - RNOA. Occurrence dataset. <a href="https://doi.org/10.15472/iqnpse" target="_blank" rel="noopener noreferrer">https://doi.org/10.15472/iqnpse</a>, accessed via GBIF.org on 2024-11-11.
        </footer>
      </div>
  );
}
