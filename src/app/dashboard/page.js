'use client'
import { useState, useEffect } from 'react';
import styles from "./../page.module.css";
import styles2 from "./page.module.css";
import Plot from 'react-plotly.js';

export default function Dashboard() {
  const [taxonomicData, setTaxonomicData] = useState([]);
  const [yearlyObservations, setYearlyObservations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topBirds, setTopBirds] = useState([]);

  useEffect(() => {
    fetch('/taxonomic_data.json')
      .then(response => response.json())
      .then(data => setTaxonomicData(data))
      .catch(error => console.error('Error fetching taxonomic data:', error));
  }, []);

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
  
  return (
    <div>
      {/* Navigation Bar */}
      <nav className={styles2.navigation}>
        <img src="/Avicol.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
        <ul className={styles.navList}>
          <li className={styles2.navItem}><a href="/">Home</a></li>
          <li className={styles2.navItem}><a href="/about">About</a></li>
          <li className={styles2.navItem}><a href="/birds">Birds</a></li>
          <li className={styles2.navItem}><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <div className={styles2.container}>
        {/* Title Section for Insights */}
        <div className={styles2.insightsTitleSection}>
          <h1 className={styles2.title}>
            <span>Explore</span> Valuable <span className={styles2.insights}>Insights</span> on <span className={styles2.birds}>Bird Populations</span>
          </h1>
          <p className={styles2.description}>
            Dive into data-driven insights to understand bird distribution, habitat preferences, and seasonal sightings across Colombia.
          </p>
        </div>

        {/* Plots Container */}
        <div className={styles2.plotContainer}>
          {/* Yearly Observations Line Chart */}
          <div className={styles2.plot}>
            <Plot
              data={[{
                x: yearlyObservations.map(d => d.year),
                y: yearlyObservations.map(d => d.count),
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
              }]}
              layout={{ 
                title: 'Bird Observations by Year', 
                xaxis: { title: 'Year' }, 
                yaxis: { title: 'Observation Count' },
                width: 500, 
                height: 400,
                responsive: true
              }}
            />
          </div>

          {/* Top 10 Observation Locations Bar Chart */}
          <div className={styles2.plot}>
            <Plot
              data={[{
                x: topLocations.map(d => d.location),
                y: topLocations.map(d => d.count),
                type: 'bar',
                marker: { color: 'green' },
              }]}
              layout={{ 
                title: 'Top 10 Observation Locations', 
                xaxis: { title: 'Location' }, 
                yaxis: { title: 'Observation Count' },
                width: 500, 
                height: 400,
                responsive: true
              }}
            />
          </div>

          {/* Top 10 Birds Bar Chart */}
          <div className={styles2.plot}>
            <Plot
              data={[{
                x: topBirds.map(d => d.scientificName),
                y: topBirds.map(d => d.count),
                type: 'bar',
                marker: { color: 'purple' },
              }]}
              layout={{ 
                title: 'Top 10 Most Observed Bird Species', 
                xaxis: { title: 'Bird Species' }, 
                yaxis: { title: 'Observation Count' },
                width: 500, 
                height: 400,
                responsive: true
              }}
            />
          </div>

          {/* Taxonomy Sunburst Chart */}
          <div className={styles2.plot}>
            <h2> ERROR </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
