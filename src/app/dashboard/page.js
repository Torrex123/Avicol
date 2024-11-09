'use client'
// pages/dashboard.js
import { useState, useEffect } from 'react';
import styles from "./../page.module.css";
import styles2 from "./page.module.css";
import Image from 'next/image';
import Plot from 'react-plotly.js';

export default function Dashboard() {
  const [taxonomicData, setTaxonomicData] = useState([]);
  const [yearlyObservations, setYearlyObservations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);

  // Fetch Taxonomic Data
  useEffect(() => {
    fetch('/taxonomic_data.json')
      .then(response => response.json())
      .then(data => setTaxonomicData(data))
      .catch(error => console.error('Error fetching taxonomic data:', error));
  }, []);

  // Fetch Yearly Observations Data
  useEffect(() => {
    fetch('/yearly_observations.json')
      .then(response => response.json())
      .then(data => setYearlyObservations(data))
      .catch(error => console.error('Error fetching yearly observations:', error));
  }, []);

  // Fetch Top Locations Data
  useEffect(() => {
    fetch('/top_locations.json')
      .then(response => response.json())
      .then(data => setTopLocations(data))
      .catch(error => console.error('Error fetching top locations:', error));
  }, []);

  // Prepare Data for Taxonomic Sunburst
  const prepareSunburstData = () => {
    // Ensure taxonomicData is loaded
    if (taxonomicData.length === 0) return null;

    // Organize data into hierarchical structure
    const hierarchy = {};

    taxonomicData.forEach(item => {
      const { kingdom, phylum, class: className, order, family, genus, species, count } = item;

      if (!hierarchy[kingdom]) hierarchy[kingdom] = {};
      if (!hierarchy[kingdom][phylum]) hierarchy[kingdom][phylum] = {};
      if (!hierarchy[kingdom][phylum][className]) hierarchy[kingdom][phylum][className] = {};
      if (!hierarchy[kingdom][phylum][className][order]) hierarchy[kingdom][phylum][className][order] = {};
      if (!hierarchy[kingdom][phylum][className][order][family]) hierarchy[kingdom][phylum][className][order][family] = {};
      if (!hierarchy[kingdom][phylum][className][order][family][genus]) hierarchy[kingdom][phylum][className][order][family][genus] = {};

      if (!hierarchy[kingdom][phylum][className][order][family][genus][species]) {
        hierarchy[kingdom][phylum][className][order][family][genus][species] = 0;
      }
      hierarchy[kingdom][phylum][className][order][family][genus][species] += count;
    });

    // Function to traverse the hierarchy and prepare Plotly data
    const labels = [];
    const parents = [];
    const values = [];

    const traverse = (node, parentLabel) => {
      for (const key in node) {
        const currentLabel = key;
        labels.push(currentLabel);
        parents.push(parentLabel);
        values.push(node[key].count || 0); // Assign count or 0

        if (typeof node[key] === 'object') {
          traverse(node[key], currentLabel);
        }
      }
    };

    traverse(hierarchy, '');

    return { labels, parents, values };
  };

  const sunburstData = prepareSunburstData();

  return (
    <div className={styles2.container}>
      {/* Navigation Bar */}
      <nav className={styles.navigation}>
        <Image src="/Avicol.png" alt="logo" width={240} height={240} style={{ cursor: 'pointer' }} />
        <ul className={styles.navList}>
          <li className={styles2.navItem}><a href="/">Home</a></li>
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

      {/* Taxonomic Plot */}
      <div className={styles2.plotContainer}>
        <h2>Taxonomic Hierarchy</h2>
        {sunburstData && (
          <Plot
            data={[
              {
                type: "sunburst",
                labels: sunburstData.labels,
                parents: sunburstData.parents,
                values: sunburstData.values,
                branchvalues: "total",
              },
            ]}
            layout={{ title: 'Bird Taxonomic Hierarchy', height: 600 }}
          />
        )}
      </div>

      {/* Yearly Observations Line Chart */}
      <div className={styles2.plotContainer}>
        <h2>Bird Observations Over the Years</h2>
        <Plot
          data={[
            {
              x: yearlyObservations.map(d => d.year),
              y: yearlyObservations.map(d => d.count),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'blue' },
            },
          ]}
          layout={{ title: 'Bird Observations by Year', xaxis: { title: 'Year' }, yaxis: { title: 'Observation Count' } }}
        />
      </div>

      {/* Top 10 Observation Locations Bar Chart */}
      <div className={styles2.plotContainer}>
        <h2>Top 10 Observation Locations</h2>
        <Plot
          data={[
            {
              x: topLocations.map(d => d.location),
              y: topLocations.map(d => d.count),
              type: 'bar',
              marker: { color: 'green' },
            },
          ]}
          layout={{ title: 'Top Observation Locations', xaxis: { title: 'Location' }, yaxis: { title: 'Observation Count' } }}
        />
      </div>
    </div>
  );
}
