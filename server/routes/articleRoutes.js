const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Article = require("../models/Article");

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});


// ✅ Create Article (POST)
router.post("/", upload.array("images", 5), async (req, res) => {
    try {
        console.log("Uploaded Files:", req.files);

        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
            writer: req.body.writer, 
            illustrator: req.body.illustrator,
            language: req.body.language,
            category: req.body.category,
            images: imagePaths
        });

        await newArticle.save();
        res.status(201).json({ message: "Article created successfully!", article: newArticle });
    } catch (error) {
        console.error("❌ Error creating article:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Get All Articles (GET)
router.get("/", async (req, res) => {
    try {
        const { language } = req.query;
        const query = language ? { language } : {};
        const articles = await Article.find(query);
        res.json(articles);
    } catch (error) {
        console.error("❌ Error fetching articles:", error);
        res.status(500).json({ message: "Error fetching articles", error });
    }
});

// ✅ Get Single Article (GET)
router.get("/:id", async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: "Error fetching article", error });
    }
});

// ✅ Update Article (PUT)
router.put("/:id", upload.array("images", 5), async (req, res) => {
    try {
        console.log("Uploaded Files:", req.files);

        const updatedData = {
            title: req.body.title,
            content: req.body.content,
            writer: req.body.writer, 
            illustrator: req.body.illustrator, 
            language: req.body.language,
            category: req.body.category
        };

        if (req.files.length > 0) {
            updatedData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedArticle) return res.status(404).json({ message: "Article not found" });

        res.json({ message: "Article updated successfully!", article: updatedArticle });
    } catch (error) {
        console.error("❌ Error updating article:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Delete Article (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        if (!deletedArticle) return res.status(404).json({ message: "Article not found" });
        res.json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting article", error });
    }
});

// ✅ Serve Uploaded Images
router.use("/uploads", express.static("uploads"));

module.exports = router;
