import React, { useEffect, useState } from 'react';

const Statistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3004/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>; // Display loading while data is being fetched
  }

  return (
    <div style={styles.statsContainer}>
      <h2 style={styles.title}>Statistics</h2>
      <div style={styles.statsRow}>
        <div style={styles.statsCard}>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div style={styles.statsCard}>
          <h3>Total Books</h3>
          <p>{stats.totalBooks}</p>
        </div>
        <div style={styles.statsCard}>
          <h3>Total Borrowed Books</h3>
          <p>{stats.totalBorrowedBooks}</p>
        </div>
        <div style={styles.statsCard}>
          <h3>Active Sessions</h3>
          <p>{stats.activeSessions}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#F5F5DC', // Soft beige background
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '80%',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    color: '#6F4F37', // Deep brown color
    fontFamily: 'Arial, sans-serif',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between', // Distributes cards horizontally with space between
    flexWrap: 'wrap', // Allows cards to wrap onto the next line if screen is too small
    gap: '20px', // Adds space between cards
    width: '100%',
    maxWidth: '1200px', // Limits the row width on larger screens
  },
  statsCard: {
    backgroundColor: '#FBE9D7', // Light beige background
    padding: '25px',
    margin: '15px 0',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '220px', // Adjust width to fit better in row
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#6F4F37', // Deep brown color for text
  },
};

export default Statistics;
