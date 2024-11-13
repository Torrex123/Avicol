import styles2 from './page.module.css';
import Link from 'next/link';

export default function About() {
  return (
    <div className={styles2.aboutContainer}>

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

      {/* Header with Background Image */}
      <header className={styles2.header}>
        <h1 className={styles2.title}>About AVICOL</h1>
        <p className={styles2.subtitle}>Exploring the Rich Avian Diversity of Colombia's Territory</p>
      </header>

      {/* About Section */}
      <section className={styles2.aboutSection}>
        <div className={styles2.content}>
          <h2>Project Overview</h2>
          <p>
            AVICOL is a project created for the course <strong> Aves del Caribe Colombiano </strong>, aimed at showcasing the distribution of Colombian bird&apos;s species based on an extensive dataset of observations.
          </p>
        </div>
        <div className={styles2.imageContainer}>
          <img src="/ar.jpg" alt="Colombian bird species" className={styles2.aboutImage} />
        </div>
      </section>

      {/* Dataset Details */}
      <section className={styles2.datasetSection}>
        <h2>Dataset Details</h2>
        <p>
        The data spans from 1948 to 2011, documenting 413,272 bird records with comprehensive taxonomic and geographical information. This work is a result of various initiatives, including DATAves, Cerrejón Valley Bird Monitoring, Christmas Bird Counts, and many others.
        </p>
        <ul className={styles2.datasetList}>
          <li><strong>Temporal Scale:</strong> April 28, 1948 - August 25, 2011</li>
          <li><strong>Geographical Scope:</strong> Extensive coverage of Colombian territory</li>
          <li><strong>Funding Sources:</strong> Supported by the Society for Antioquian Ornithology (SAO), Red Nacional de Observadores de Aves (RNOA), and Instituto de Investigaciones Biológicas Alexander von Humboldt.</li>
          <li><strong>Data Hosting:</strong> Sistema de Información sobre Biodiversidad de Colombia - SiB</li>
          <li><strong>License:</strong> CC0 1.0</li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className={styles2.footer}>
        Red Nacional de Observadores de Aves, Naranjo Maury G (2022). DATAVES. Version 7.5. Red Nacional de Observadores de Aves - RNOA. Occurrence dataset. <Link href="https://doi.org/10.15472/iqnpse" target="_blank" rel="noopener noreferrer">https://doi.org/10.15472/iqnpse</Link>, accessed via GBIF.org on 2024-11-11.
      </footer>
    </div>
  );
}
