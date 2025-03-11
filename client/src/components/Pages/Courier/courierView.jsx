import React, { useState, useEffect } from "react";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [language, setLanguage] = useState("");
    const [category, setCategory] = useState("");

    // Function to build API URL correctly
    const buildApiUrl = () => {
        let url = "http://localhost:3004/api/articles?";
        const params = [];

        if (language) params.push(`language=${encodeURIComponent(language)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);

        return url + params.join("&");
    };

    // Fetch articles whenever filters change
    useEffect(() => {
        fetch(buildApiUrl())
            .then((res) => res.json())
            .then((data) => setArticles(data))
            .catch((err) => console.error("❌ Error fetching articles:", err));
    }, [language, category]);

    // Function to get the correct image URLs (handles multiple images)
    const getImageUrls = (imagePaths) => {
        if (!imagePaths || imagePaths.length === 0) return [];
        return imagePaths.map((path) => `http://localhost:3004${path}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>📜 Courier Club News</h2>

            {/* Language Filter */}
            <select onChange={(e) => setLanguage(e.target.value)} style={styles.filter}>
                <option value="">🌍 All Languages</option>
                <option value="English">🇬🇧 English</option>
                <option value="Tagalog">🇵🇭 Tagalog</option>
            </select>

            {/* Scrollable Article List */}
            <div style={styles.articleList}>
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div
                            key={article._id}
                            onClick={() => setSelectedArticle(article)}
                            style={styles.articleItem}
                        >
                            {article.images?.length > 0 && (
                                <div style={styles.imageContainer}>
                                    {getImageUrls(article.images).map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`Article ${index + 1}`}
                                            style={styles.thumbnail}
                                            onError={(e) => e.target.style.display = "none"}
                                        />
                                    ))}
                                </div>
                            )}
                            <div>
                                <h3 style={styles.articleTitle}>{article.title}</h3>
                                <p style={styles.articlePreview}>{article.content.substring(0, 120)}...</p>
                                <small style={styles.articleInfo}>
                                    📝 Writer: {article.writer || "Unknown"} | 🎨 Illustrator: {article.illustrator || "Unknown"}
                                    <br />📂 Category: <strong>{article.category || "Uncategorized"}</strong>
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={styles.noArticles}>No articles found.</p>
                )}
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>
                            {selectedArticle.title}
                        </h2>

                        {selectedArticle.images?.length > 0 && (
                            <div style={styles.modalImageContainer}>
                                {getImageUrls(selectedArticle.images).map((imageUrl, index) => (
                                    <img key={index} src={imageUrl} alt={`Article ${index + 1}`} style={styles.modalImage} />
                                ))}
                            </div>
                        )}

                        <div style={styles.modalContent}>
                            <p style={styles.modalText}>{selectedArticle.content}</p>
                            <p style={styles.modalText}>
                                <span style={styles.modalTextStrong}>Writer:</span> {selectedArticle.writer || "Unknown"}
                            </p>
                            <p style={styles.modalText}>
                                <span style={styles.modalTextStrong}>Illustrator:</span> {selectedArticle.illustrator || "Unknown"}
                            </p>
                            <p style={styles.modalText}>
                                <span style={styles.modalTextStrong}>Category:</span> {selectedArticle.category || "Uncategorized"}
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedArticle(null)}
                            style={styles.closeButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#bf360c"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#d84315"}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS-in-JS styling
const styles = {
    container: {
        padding: "20px",
        maxWidth: "850px",
        margin: "auto",
        fontFamily: "'Merriweather', serif",
        backgroundColor: "#faf3e0",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#4e342e",
        fontSize: "26px",
        fontWeight: "bold",
        marginBottom: "15px",
    },
    filter: {
        marginBottom: "10px",
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#d7ccc8",
        border: "none",
        borderRadius: "8px",
        color: "#4e342e",
        fontWeight: "bold",
        display: "block",
        width: "100%",
        maxWidth: "250px",
        margin: "auto",
        cursor: "pointer",
    },
    articleList: {
        maxHeight: "400px",
        overflowY: "auto",
        border: "2px solid #8d6e63",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#fff8f0",
    },
    articleItem: {
        padding: "15px",
        borderBottom: "1px solid #d7ccc8",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        borderRadius: "8px",
        transition: "background 0.3s, transform 0.2s",
    },
    imageContainer: {
        display: "flex",
        gap: "10px",
    },
    thumbnail: {
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "2px solid #795548",
    },
    articleTitle: {
        margin: "0",
        color: "#4e342e",
        fontSize: "18px",
        fontWeight: "bold",
    },
    articlePreview: {
        margin: "5px 0",
        fontSize: "14px",
        color: "#6d4c41",
    },
    articleInfo: {
        color: "#795548",
        fontStyle: "italic",
    },
    noArticles: {
        color: "#5d4037",
        textAlign: "center",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fffaf3",
        padding: "25px",
        borderRadius: "12px",
        width: "60%",
        maxHeight: "80%",
        overflowY: "auto",
    },
    modalTitle: {
        fontSize: "30px",
        fontWeight: "600",
        color: "#4e342e",
        marginBottom: "20px",
    },
    modalImageContainer: {
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        paddingBottom: "10px",
    },
    modalImage: {
        maxWidth: "100%",
        maxHeight: "400px",
        objectFit: "contain",
        borderRadius: "8px",
    },
    modalContent: {
        width: "100%",
        marginTop: "20px",
        textAlign: "left",
    },
    modalText: {
        fontSize: "18px",
        lineHeight: "1.8",
        color: "#333",
        marginBottom: "15px",
        textAlign: "justify",
    },
    modalTextStrong: {
        fontWeight: "bold",
        color: "#4e342e",
    },
    closeButton: {
        display: "block",
        margin: "20px auto 0",
        padding: "10px 15px",
        backgroundColor: "#d84315",
        color: "white",
        borderRadius: "8px",
    },
};

export default ArticleList;
