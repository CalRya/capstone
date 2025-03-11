import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ArticlePreview = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3004/api/articles");
        setArticles(response.data.slice(0, 5)); // Limit to 5 articles
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div style={styles.articlePreview}>
      <h2 style={styles.header}>Explore Our Articles</h2>
      <div style={styles.articlePreviewContainer}>
        <div style={styles.articlePreviewList}>
          {articles.map((article) => (
            <div key={article._id} style={styles.articleCard}>
              <img
                src={`http://localhost:3004${article.images[0]}`}
                alt="Article Image"
                style={styles.articleCover}
              />
              <div style={styles.cardContent}>
                <p style={styles.articleTitle}>{article.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.moreArticlesContainer}>
        <Link to="/courierarticles" style={styles.moreArticlesBtn}>
          More Articles
        </Link>
      </div>
    </div>
  );
};

const styles = {
  articlePreview: {
    padding: "30px",
    backgroundColor: "#faf3e0",
    borderRadius: "12px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "auto",
  },
  header: {
    fontSize: "32px",
    marginBottom: "30px",
    color: "#3e2723",
    fontWeight: "600",
    letterSpacing: "1px",
  },
  articlePreviewContainer: {
    display: "flex",
    justifyContent: "center",
  },
  articlePreviewList: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    maxWidth: "100%",
  },
  articleCard: {
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  articleCover: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderBottom: "5px solid #f2a7a1",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  articleTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4e342e",
    margin: "0",
  },
  moreArticlesContainer: {
    marginTop: "40px",
  },
  moreArticlesBtn: {
    padding: "12px 25px",
    backgroundColor: "#d84315",
    color: "white",
    fontSize: "18px",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "background-color 0.3s, transform 0.3s",
    "&:hover": {
      backgroundColor: "#b23c13",
      transform: "scale(1.05)",
    },
  },
};

export default ArticlePreview;
