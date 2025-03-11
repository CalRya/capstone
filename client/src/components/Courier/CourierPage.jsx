import React, { useState, useEffect } from "react";
import NavbarCourier from "../Navbar/NavbarCourier";

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writer, setWriter] = useState("");
    const [illustrator, setIllustrator] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
const [previewImages, setPreviewImages] = useState([]);

    const [articleLanguage, setArticleLanguage] = useState("English");
    const [category, setCategory] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = () => {
        fetch("http://localhost:3004/api/articles")
            .then((res) => res.json())
            .then((data) => setArticles(data))
            .catch((err) => console.error("❌ Error fetching articles:", err));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        
        // Create object URLs for previews
        const imagePreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(imagePreviews);
    };
    
    

    const handleSubmit = async () => {
        if (editing && !selectedArticle?._id) {
            console.error("❌ Error: No selected article ID.");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("writer", writer);
        formData.append("illustrator", illustrator);
        formData.append("language", articleLanguage);
        formData.append("category", category);
    
        // Append multiple image files
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });
    
        const requestOptions = {
            method: editing ? "PUT" : "POST",
            body: formData
        };
    
        const url = editing 
            ? `http://localhost:3004/api/articles/${selectedArticle._id}`
            : "http://localhost:3004/api/articles";
    
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error("Failed to save article");
    
            fetchArticles();
            resetForm();
        } catch (error) {
            console.error("❌ Error saving article:", error);
        }
    };
    
    
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this article?")) return;

        try {
            const response = await fetch(`http://localhost:3004/api/articles/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete article");

            fetchArticles();
        } catch (error) {
            console.error("❌ Error deleting article:", error);
        }
    };

    const handleEdit = (article) => {
        setSelectedArticle(article);
        setTitle(article.title);
        setContent(article.content);
        setWriter(article.writer);
        setIllustrator(article.illustrator);
        setArticleLanguage(article.language);
        setCategory(article.category);
        setPreviewImages(article.images ? `http://localhost:3004${article.images}` : null);
        setEditing(true);
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setWriter("");
        setIllustrator("");
        setArticleLanguage("English");
        setCategory("");
        setImageFiles(null);
        setPreviewImages(null);
        setEditing(false);
        setSelectedArticle(null);
    };

    return (
        <div style={{ paddingTop: "80px", backgroundColor: "#faf3e0", minHeight: "100vh" }}>
            <NavbarCourier />

            <div style={{
                padding: "20px",
                maxWidth: "850px",
                margin: "auto",
                fontFamily: "'Merriweather', serif",
                backgroundColor: "#fff8f0",
                borderRadius: "12px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{ textAlign: "center", color: "#4e342e", fontSize: "26px", fontWeight: "bold" }}>📢 Manage Articles</h2>

                {/* Article Form */}
                <div style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    marginBottom: "20px"
                }}>
                    <h3 style={{ color: "#4e342e", textAlign: "center" }}>{editing ? "✏️ Edit Article" : "📝 Add Article"}</h3>

                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "2px solid #d7ccc8", borderRadius: "8px" }} />

                    <input type="text" placeholder="Writer" value={writer} onChange={(e) => setWriter(e.target.value)}
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "2px solid #d7ccc8", borderRadius: "8px" }} />

                    <input type="text" placeholder="Illustrator/Graphic Designer" value={illustrator} onChange={(e) => setIllustrator(e.target.value)}
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "2px solid #d7ccc8", borderRadius: "8px" }} />

                    <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows="5"
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "2px solid #d7ccc8", borderRadius: "8px" }}></textarea>

<input type="file" accept="image/*" multiple onChange={handleImageChange} />


                    {previewImages && <img src={previewImages} alt="Preview" style={{ width: "100%", borderRadius: "8px", border: "2px solid #795548", marginTop: "10px" }} />}

                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px" }}>
                        <option value="">🗂 Select Category</option>
                        <option value="Motivational Monday">📅 Motivational Monday</option>
                        <option value="CommuniTeach Tuesday">📚 CommuniTeach Tuesday</option>
                        <option value="Wellness Wednesday">💆 Wellness Wednesday</option>
                        <option value="Reform Thursday">🏛️ Reform Thursday</option>
                        <option value="Senti Sabado">💭 Senti Sabado</option>
                        <option value="Lenterature">📖 Lenterature / Litsun</option>
                    </select>

                    <select value={articleLanguage} onChange={(e) => setArticleLanguage(e.target.value)}
                        style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px" }}>
                        <option value="English">🇬🇧 English</option>
                        <option value="Tagalog">🇵🇭 Tagalog</option>
                    </select>

                    <button onClick={handleSubmit} style={{
                        width: "100%", padding: "12px", backgroundColor: "#6d4c41", color: "white", borderRadius: "8px"
                    }}>
                        {editing ? "Update Article" : "Submit"}
                    </button>
                </div>

{/* Article List */}
<div style={{
    maxHeight: "400px",
    overflowY: "auto",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fff8f0",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
}}>
    {articles.map((article) => (
        <div 
            key={article._id} 
            style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                backgroundColor: selectedArticle?._id === article._id ? "#fbe9e7" : "white",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                borderBottom: "1px solid #ddd",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                marginBottom: "10px"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
            onClick={() => handleEdit(article)}
        >
            <span style={{
                color: "#6d4c41",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}>
                ✏️ {article.title}
            </span>
            
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(article._id); 
                }} 
                style={{
                    backgroundColor: "#d84315",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background 0.3s ease, transform 0.2s ease"
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#bf360c";
                    e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#d84315";
                    e.target.style.transform = "scale(1.0)";
                }}
            >
                🗑️ Delete
            </button>
        </div>
    ))}
</div>

            </div>
        </div>
    );
};

export default ArticleManager;
