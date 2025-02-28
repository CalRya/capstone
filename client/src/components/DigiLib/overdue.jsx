import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
    const [overdueBooks, setOverdueBooks] = useState([]);

    useEffect(() => {
        const fetchOverdueBooks = async () => {
            try {
                const response = await axios.get("http://localhost:3004/api/borrow/overdue");
                setOverdueBooks(response.data);
            } catch (error) {
                console.error("❌ Error fetching overdue books:", error);
            }
        };

        fetchOverdueBooks();
    }, []);

    return (
        <div>
            <h2>📢 Overdue Books</h2>
            {overdueBooks.length === 0 ? (
                <p>No overdue books 🎉</p>
            ) : (
                <ul>
                    {overdueBooks.map((borrow) => (
                        <li key={borrow._id}>
                            <strong>{borrow.book.bookTitle}</strong> is overdue! Borrowed by {borrow.user.name}.
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
