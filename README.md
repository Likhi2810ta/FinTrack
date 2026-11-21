# FinTrack – Personal Finance Tracker

A full-stack personal finance management application built to help users track income, expenses, manage transactions, and visualize their financial health through an interactive dashboard.

## Features

- **Dashboard:** View total balance, income, expenses, and transaction count.
- **Transaction Management:** Add, edit, and delete transactions.
- **Income & Expense Tracking:** Categorize financial transactions.
- **Analytics:** Visualize income and expenses through charts.
- **Expense Categories:** Understand spending patterns across categories.
- **Filtering & Search:** Filter transactions by type, category, date, and search.
- **Authentication:** Secure user registration and login using JWT.
- **Responsive UI:** Clean and intuitive interface.

## Tech Stack

### Frontend
- React.js
- CSS
- Axios
- Chart.js

### Backend
- Python
- FastAPI
- JWT Authentication

### Database
- MongoDB

## Project Structure

```text
FinTrack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── main.py
│   └── requirements.txt
│
└── README.md
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Likhi2810ta/FinTrack.git
cd FinTrack
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

**Windows**
```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your environment variables in a `.env` file:

```env
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

Backend API will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The application will be available at the local URL provided by Vite.

## Application Screenshots

### Dashboard

The dashboard provides a quick overview of the user's financial status, including total balance, income, expenses, and transaction statistics.

<!-- Add dashboard screenshot here -->

## Future Improvements

- Budget creation and tracking
- Monthly financial reports
- Export transactions to CSV/PDF
- Recurring transactions
- Savings goals
- Improved data visualization
- Deployment

## Author

**Likhi**

GitHub: [Likhi2810ta](https://github.com/Likhi2810ta)

## License

This project is developed for educational and personal use.
