# Chemical Equipment Parameter Visualizer (Hybrid Web + Desktop App)

A full-stack hybrid application designed to analyze and visualize chemical equipment parameters (Flowrate, Pressure, Temperature) from CSV data. This project features a synchronized **React Web Dashboard** and a **PyQt5 Desktop Application**, both powered by a central **Django REST Framework** backend hosted on Microsoft Azure.

### 🚀 **Live Demo**
- **Web Application:** [https://f12-weld.vercel.app/](https://f12-weld.vercel.app/)
- **Backend API:** Hosted on Microsoft Azure (Basic Plan B1 - Linux App Service)

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend (Web)** | React.js, Chart.js, Tailwind CSS | Interactive dashboard, charts, and tables |
| **Frontend (Desktop)** | Python, PyQt5, Matplotlib | Native desktop client with synchronized data |
| **Backend** | Django, Django REST Framework | Central API, authentication, and data processing |
| **Database** | SQLite | Persistent data storage (Persistent mount on Azure) |
| **Data Processing** | Pandas | CSV parsing and statistical analysis |
| **Authentication** | JWT (JSON Web Token) | Secure login for both Web and Desktop clients |

---

## ✨ Key Features
* **Hybrid Architecture:** Seamless synchronization between Web and Desktop clients using a single cloud backend.
* **Secure Authentication:** JWT-based login and registration system.
* **CSV Data Processing:** Upload CSV files containing equipment data (Type, Flowrate, Pressure, Temperature).
* **Visual Analytics:** Interactive Pie charts (Chart.js on Web, Matplotlib on Desktop) showing equipment type distribution.
* **Summary Statistics:** Automatic calculation of average pressure, temperature, and flowrate.
* **History Management:** Persistent history of the last uploaded datasets.
* **PDF Reporting:** Generate downloadable PDF reports of analysis results (Web).

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
* **Python 3.10+** installed.
* **Node.js & npm** installed.
* **Git** installed.

### Clone the Repository
```bash
git clone [https://github.com/Dhruv-ub/b12.git](https://github.com/Dhruv-ub/b12.git)
cd b12
---

### 🐍 Backend Setup (Django)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    # Mac/Linux
    python3 -m venv venv
    ```

3.  **Activate the virtual environment:**
    ```bash
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```

6.  **Create a superuser (Admin access):**
    ```bash
    python manage.py createsuperuser
    ```
    *(Follow the prompts to set a username and password)*

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    *The backend will start at `http://localhost:8000`*

---

### ⚛️ Frontend Setup (React Web App)

1.  **Open a new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install Node dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the `frontend` folder and add the following line:
    ```env
    REACT_APP_API_URL=http://localhost:8000/api
    ```
    *(Note: To connect to the live Azure backend, use the Azure URL instead of localhost)*

4.  **Start the React App:**
    ```bash
    npm start
    ```
    *The web app will open at `http://localhost:3000`*

---

### 🖥️ Desktop App Setup (PyQt5)

1.  **Open a new terminal** and ensure your Python virtual environment is activated (same as Backend step 3).

2.  **Navigate to the desktop app directory:**
    ```bash
    cd "desktop app"
    ```

3.  **Run the Desktop Application:**
    ```bash
    python main.py
    ```
    *The desktop GUI will launch. You can log in using the same credentials created in the backend setup.*
```
## 🧪 Usage
1.  **Register/Login:** Create an account or use the superuser credentials.
2.  **Upload:** Navigate to the dashboard and upload the sample CSV file (`sample_equipment_data.csv`).
3.  **Analyze:** View the generated charts and summary cards.
4.  **History:** Check the history tab to see previous uploads (synced across web and desktop).
5.  **Report:** Click "Download PDF" on the web app to get a detailed report.

## ☁️ Deployment Details
* **Frontend:** Deployed on **Vercel** with continuous deployment from GitHub.
* **Backend:** Deployed on **Azure App Service (Linux)**.
    * **Plan:** Basic B1 Tier.
    * **Server:** Gunicorn production server.
    * **Database:** Persistent SQLite storage on Azure.

---

**Developed by Dhruv**
