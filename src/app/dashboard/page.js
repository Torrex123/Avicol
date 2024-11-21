'use client';
import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from "./../page.module.css";
import styles2 from "./page.module.css";
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

function groupDataByLevel(data, level) {
  const grouped = data.reduce((acc, entry) => {
    const key = entry[level] || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped),
  };
}

export default function Dashboard() {
  const [yearlyObservations, setYearlyObservations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topDepartments, setTopDepartments] = useState([]);
  const [topBirds, setTopBirds] = useState([]);
  const [topDates, setTopDates] = useState([]);

  const [taxonomyData, setTaxonomyData] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('kingdom');
  const [chartData, setChartData] = useState(null);

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

  useEffect(() => {
    fetch('/top_10_departments.json')
      .then(response => response.json())
      .then(data => setTopDepartments(data))
      .catch(error => console.error('Error fetching top birds:', error));
  }, []);

  useEffect(() => {
    fetch('/top_10_dates.json')
      .then(response => response.json())
      .then(data => setTopDates(data))
      .catch(error => console.error('Error fetching top birds:', error));
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/taxonomy_data.json');
      const data = await res.json();
      setTaxonomyData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (taxonomyData.length > 0) {
      const groupedData = groupDataByLevel(taxonomyData, selectedLevel);
      setChartData({
        labels: groupedData.labels,
        datasets: [
          {
            data: groupedData.data,
            backgroundColor: [
              '#8ab434', '#8ab434', '#A1C639', '#B4C64D', '#4B8B27',
              '#6A9C30', '#A9B33E',
            ],
            label: `Count of ${selectedLevel}`,
          },
        ],
      });
    }
  }, [taxonomyData, selectedLevel]);


  // Chart Data and Options
  const yearlyObservationsData = {
    labels: yearlyObservations.map(entry => entry.year),
    datasets: [
      {
        label: 'Bird Observations per Year',
        data: yearlyObservations.map(entry => entry.count),
        fill: false,
        borderColor: '#729f19',
        backgroundColor: '#9fcb48',
      },
    ],
  };

  const topLocationsData = {
    labels: topLocations.map(entry => entry.location),
    datasets: [
      {
        label: 'Top Locations by Observation Count',
        data: topLocations.map(entry => entry.count),
        backgroundColor: '#81b21e91',
      },
    ],
  };

  const topBirdsData = {
    labels: topBirds.map(entry => entry.scientificName),
    datasets: [
      {
        label: 'Birds Observed',
        data: topBirds.map(entry => entry.count),
        backgroundColor: [
          '#7F9F2D', '#A1C639', '#B4C64D', '#4B8B27', '#9D8A28',
          '#D1C92D', '#B1D751', '#6A9C30', '#A9B33E', '#7BA32B'
        ],
      },
    ],
  };

  const topDatesData = {
    labels: topDates.map(entry => entry.eventDate),
    datasets: [
      {
        label: 'Top Dates by Observation Count',
        data: topDates.map(entry => entry.count),
        backgroundColor: '#81b21e91',
      },
    ],
  };

  const topDepartmentsData = {
    labels: topDepartments.map(entry => entry.stateProvince),
    datasets: [
      {
        label: 'Top Departments by Observation Count',
        data: topDepartments.map(entry => entry.count),
        backgroundColor: '#81b21e91',
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5' }}>
      <div className={styles2.pagecontainer}>
        {/* Navigation Bar */}
        <div>
          <nav className={styles2.navigation}>
            <Link href="/">
              <img src="/Avicol_white.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
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

        {/* Dashboard Layout */}
        <div className={styles2.insightscontainer}>
          <div className={styles2.taxonomyChart} >
            <h1>Taxonomic Hierarchy of Bird Observations</h1>

            <label htmlFor="taxonomy-level">Select Taxonomic Level:</label>
            <select
              id="taxonomy-level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="kingdom">Kingdom</option>
              <option value="phylum">Phylum</option>
              <option value="class">Class</option>
              <option value="order">Order</option>
              <option value="family">Family</option>
              <option value="genus">Genus</option>
              <option value="species">Species</option>
            </select>

            {chartData ? (
              <Doughnut data={chartData} options={{ title: { display: true, text: `Distribution by ${selectedLevel}` } }} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>

          <div className={styles2.dashboardGrid}>
            <div className={styles2.chartContainer}>
              <h2>Top Observation Locations</h2>
              <Bar data={topLocationsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            <div className={styles2.chartContainer}>
              <h2>Top 10 Birds Observed</h2>
              <Bar data={topBirdsData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>

            <div className={styles2.chartContainer}>
              <h2>Top 10 Departments with Most Observations</h2>
              <Bar data={topDepartmentsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            <div className={styles2.chartContainer}>
              <h2>Top 10 Dates with Most Observations</h2>
              <Bar data={topDatesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className={styles2.birdObservations}>
            <h2>Bird Observations Over the Years</h2>
            <Line data={yearlyObservationsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        Red Nacional de Observadores de Aves, Naranjo Maury G (2022). DATAVES. Version 7.5. Red Nacional de Observadores de Aves - RNOA. Occurrence dataset. <Link href="https://doi.org/10.15472/iqnpse" target="_blank" rel="noopener noreferrer">https://doi.org/10.15472/iqnpse</Link>, accessed via GBIF.org on 2024-11-11.
      </footer>
    </div>
  );
}

