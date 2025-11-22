import sys
import requests
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QPushButton, QLabel, QFileDialog, 
                             QTableWidget, QTableWidgetItem, QTabWidget, 
                             QMessageBox, QGroupBox, QHeaderView, QLineEdit,
                             QStackedWidget, QFormLayout, QListWidget, QListWidgetItem)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

# Matplotlib imports for PyQt5
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

# --- Configuration ---
API_BASE_URL = "https://chemicalrg-d7cjcxaaa6a7a4he.southeastasia-01.azurewebsites.net/api"

STYLESHEET = """
    QWidget {
        background-color: #f5f6fa;
        font-family: 'Segoe UI', sans-serif;
    }
    QLabel {
        color: #2c3e50;
        font-size: 14px;
    }
    QLineEdit {
        padding: 10px;
        border: 2px solid #dcdde1;
        border-radius: 5px;
        background-color: white;
        font-size: 14px;
    }
    QLineEdit:focus {
        border: 2px solid #3498db;
    }
    QPushButton {
        background-color: #3498db;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #2980b9;
    }
    QPushButton#SecondaryButton {
        background-color: transparent;
        color: #3498db;
        text-decoration: underline;
    }
    QPushButton#SecondaryButton:hover {
        color: #2980b9;
    }
    QGroupBox {
        border: 2px solid #dcdde1;
        border-radius: 5px;
        margin-top: 10px;
        font-weight: bold;
    }
    QGroupBox::title {
        subcontrol-origin: margin;
        left: 10px;
        padding: 0 5px;
    }
"""

class APIManager:
    """Handles API requests and stores the authentication token."""
    def __init__(self):
        self.token = None
        self.user_data = None

    def set_token(self, token):
        self.token = token

    def get_headers(self):
        if self.token:
            return {'Authorization': f'Bearer {self.token}'}
        return {}

    def login(self, username, password):
        try:
            response = requests.post(f"{API_BASE_URL}/login/", data={
                'username': username, 
                'password': password
            })
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access')
                return True, "Login Successful"
            else:
                return False, response.json().get('detail', 'Login Failed')
        except Exception as e:
            return False, str(e)

    def register(self, username, email, password):
        try:
            response = requests.post(f"{API_BASE_URL}/register/", data={
                'username': username,
                'email': email,
                'password': password
            })
            if response.status_code == 201:
                return True, "Registration Successful"
            else:
                return False, str(response.json())
        except Exception as e:
            return False, str(e)

    def upload_file(self, file_path):
        try:
            with open(file_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(
                    f"{API_BASE_URL}/upload/", 
                    files=files, 
                    headers=self.get_headers()
                )
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, response.text
        except Exception as e:
            return False, str(e)

    def get_history(self):
        try:
            response = requests.get(
                f"{API_BASE_URL}/history/", 
                headers=self.get_headers()
            )
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, response.text
        except Exception as e:
            return False, str(e)
            
    def get_history_detail(self, history_id):
        try:
            response = requests.get(
                f"{API_BASE_URL}/history/{history_id}/", 
                headers=self.get_headers()
            )
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, response.text
        except Exception as e:
            return False, str(e)

# Global API Manager instance
api_manager = APIManager()

class MplCanvas(FigureCanvas):
    """A simple class to display Matplotlib plots in PyQt."""
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        self.fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = self.fig.add_subplot(111)
        super(MplCanvas, self).__init__(self.fig)

class LoginWindow(QWidget):
    def __init__(self, switch_callback):
        super().__init__()
        self.switch_callback = switch_callback
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # Title
        title = QLabel("Login")
        title.setAlignment(Qt.AlignCenter)
        title.setFont(QFont("Arial", 24, QFont.Bold))
        title.setStyleSheet("color: #2c3e50; margin-bottom: 20px;")
        layout.addWidget(title)
        
        # Container for form to center it
        container = QWidget()
        container.setFixedWidth(400)
        container_layout = QVBoxLayout(container)
        
        # Form
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        
        container_layout.addWidget(QLabel("Username"))
        container_layout.addWidget(self.username_input)
        container_layout.addWidget(QLabel("Password"))
        container_layout.addWidget(self.password_input)
        container_layout.addSpacing(20)

        # Buttons
        self.login_btn = QPushButton("Login")
        self.login_btn.setCursor(Qt.PointingHandCursor)
        self.login_btn.clicked.connect(self.handle_login)
        container_layout.addWidget(self.login_btn)

        self.register_link = QPushButton("Don't have an account? Register")
        self.register_link.setObjectName("SecondaryButton")
        self.register_link.setCursor(Qt.PointingHandCursor)
        self.register_link.setFlat(True)
        self.register_link.clicked.connect(lambda: self.switch_callback("register"))
        container_layout.addWidget(self.register_link)
        
        # Add container to main layout with centering
        layout.addStretch()
        layout.addWidget(container, 0, Qt.AlignCenter)
        layout.addStretch()

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()
        
        if not username or not password:
            QMessageBox.warning(self, "Error", "Please fill in all fields")
            return

        success, message = api_manager.login(username, password)
        if success:
            self.switch_callback("dashboard")
        else:
            QMessageBox.critical(self, "Login Failed", message)

class RegisterWindow(QWidget):
    def __init__(self, switch_callback):
        super().__init__()
        self.switch_callback = switch_callback
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        title = QLabel("Register")
        title.setAlignment(Qt.AlignCenter)
        title.setFont(QFont("Arial", 24, QFont.Bold))
        title.setStyleSheet("color: #2c3e50; margin-bottom: 20px;")
        layout.addWidget(title)

        # Container
        container = QWidget()
        container.setFixedWidth(400)
        container_layout = QVBoxLayout(container)

        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")
        self.email_input = QLineEdit()
        self.email_input.setPlaceholderText("Email")
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        
        container_layout.addWidget(QLabel("Username"))
        container_layout.addWidget(self.username_input)
        container_layout.addWidget(QLabel("Email"))
        container_layout.addWidget(self.email_input)
        container_layout.addWidget(QLabel("Password"))
        container_layout.addWidget(self.password_input)
        container_layout.addSpacing(20)

        self.register_btn = QPushButton("Register")
        self.register_btn.setCursor(Qt.PointingHandCursor)
        self.register_btn.clicked.connect(self.handle_register)
        container_layout.addWidget(self.register_btn)

        self.login_link = QPushButton("Already have an account? Login")
        self.login_link.setObjectName("SecondaryButton")
        self.login_link.setCursor(Qt.PointingHandCursor)
        self.login_link.setFlat(True)
        self.login_link.clicked.connect(lambda: self.switch_callback("login"))
        container_layout.addWidget(self.login_link)
        
        layout.addStretch()
        layout.addWidget(container, 0, Qt.AlignCenter)
        layout.addStretch()

    def handle_register(self):
        username = self.username_input.text()
        email = self.email_input.text()
        password = self.password_input.text()
        
        if not username or not password:
            QMessageBox.warning(self, "Error", "Please fill in all fields")
            return

        success, message = api_manager.register(username, email, password)
        if success:
            QMessageBox.information(self, "Success", "Registration successful! Please login.")
            self.switch_callback("login")
        else:
            QMessageBox.critical(self, "Registration Failed", message)

class DashboardWindow(QWidget):
    def __init__(self, logout_callback):
        super().__init__()
        self.logout_callback = logout_callback
        self.init_ui()

    def init_ui(self):
        self.main_layout = QVBoxLayout(self)

        # Header
        header_layout = QHBoxLayout()
        title = QLabel("Chemical Equipment Visualizer")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        logout_btn = QPushButton("Logout")
        logout_btn.setStyleSheet("background-color: #e74c3c; color: white;")
        logout_btn.setCursor(Qt.PointingHandCursor)
        logout_btn.clicked.connect(self.logout_callback)
        
        header_layout.addWidget(title)
        header_layout.addStretch()
        header_layout.addWidget(logout_btn)
        self.main_layout.addLayout(header_layout)

        # Tabs
        self.tabs = QTabWidget()
        self.main_layout.addWidget(self.tabs)

        # --- Tab 1: Analysis (Upload & Visualize) ---
        self.tab_analysis = QWidget()
        self.setup_analysis_tab()
        self.tabs.addTab(self.tab_analysis, "Analysis")

        # --- Tab 2: History ---
        self.tab_history = QWidget()
        self.setup_history_tab()
        self.tabs.addTab(self.tab_history, "History")
        
        # Connect tab change to refresh history
        self.tabs.currentChanged.connect(self.on_tab_change)

    def setup_analysis_tab(self):
        layout = QHBoxLayout(self.tab_analysis)

        # LEFT PANEL (Controls & Summary)
        left_panel = QVBoxLayout()
        
        # Upload Section
        self.upload_btn = QPushButton("📂 Upload CSV File")
        self.upload_btn.setCursor(Qt.PointingHandCursor)
        self.upload_btn.setStyleSheet("""
            QPushButton {
                background-color: #3498db; 
                color: white; 
                padding: 15px; 
                font-weight: bold;
                font-size: 16px;
            }
            QPushButton:hover {
                background-color: #2980b9;
            }
        """)
        self.upload_btn.clicked.connect(self.upload_file)
        left_panel.addWidget(self.upload_btn)

        # Summary Group Box
        self.summary_group = QGroupBox("Analysis Summary")
        self.summary_layout = QVBoxLayout()
        
        self.lbl_total = QLabel("Total Equipment: -")
        self.lbl_flow = QLabel("Avg Flowrate: -")
        self.lbl_pressure = QLabel("Avg Pressure: -")
        self.lbl_temp = QLabel("Avg Temperature: -")
        
        font = QFont()
        font.setPointSize(10)
        for lbl in [self.lbl_total, self.lbl_flow, self.lbl_pressure, self.lbl_temp]:
            lbl.setFont(font)
            self.summary_layout.addWidget(lbl)
            
        self.summary_group.setLayout(self.summary_layout)
        left_panel.addWidget(self.summary_group)
        left_panel.addStretch()
        
        # RIGHT PANEL (Chart & Table)
        right_panel = QTabWidget()
        
        # Chart Tab
        self.chart_tab = QWidget()
        chart_layout = QVBoxLayout(self.chart_tab)
        self.canvas = MplCanvas(self, width=5, height=4, dpi=100)
        chart_layout.addWidget(self.canvas)
        right_panel.addTab(self.chart_tab, "📊 Visualization")
        
        # Table Tab
        self.table_tab = QWidget()
        table_layout = QVBoxLayout(self.table_tab)
        self.table = QTableWidget()
        table_layout.addWidget(self.table)
        right_panel.addTab(self.table_tab, "📋 Raw Data")

        layout.addLayout(left_panel, 1)
        layout.addWidget(right_panel, 3)

    def setup_history_tab(self):
        layout = QHBoxLayout(self.tab_history)
        
        # List of History Items
        self.history_list = QListWidget()
        self.history_list.itemClicked.connect(self.load_history_item)
        layout.addWidget(self.history_list, 1)
        
        right_layout = QVBoxLayout()
        self.history_info = QLabel("Select a history item to view details.")
        self.history_info.setWordWrap(True)
        self.load_btn = QPushButton("Load into Analysis View")
        self.load_btn.setEnabled(False)
        self.load_btn.clicked.connect(self.load_selected_history)
        
        right_layout.addWidget(self.history_info)
        right_layout.addWidget(self.load_btn)
        right_layout.addStretch()
        
        layout.addLayout(right_layout, 1)

    def on_tab_change(self, index):
        if self.tabs.tabText(index) == "History":
            self.refresh_history()

    def refresh_history(self):
        self.history_list.clear()
        success, data = api_manager.get_history()
        if success:
            for item in data:
                label = f"ID: {item.get('id')} | Date: {item.get('upload_time')} | Items: {item.get('total_count')}"
                list_item = QListWidgetItem(label)
                list_item.setData(Qt.UserRole, item.get('id'))
                self.history_list.addItem(list_item)
        else:
            QMessageBox.warning(self, "Error", "Failed to load history")

    def load_history_item(self, item):
        history_id = item.data(Qt.UserRole)
        self.history_info.setText(f"Selected ID: {history_id}\nClick 'Load' to visualize this dataset.")
        self.load_btn.setEnabled(True)
        self.selected_history_id = history_id

    def load_selected_history(self):
        if hasattr(self, 'selected_history_id'):
            success, data = api_manager.get_history_detail(self.selected_history_id)
            if success:
                ui_data = {
                    'summary': {
                        'total_count': data.get('total_count'),
                        'avg_flowrate': data.get('avg_flowrate'),
                        'avg_pressure': data.get('avg_pressure'),
                        'avg_temperature': data.get('avg_temperature'),
                        'type_distribution': data.get('type_distribution')
                    },
                    'raw_data': data.get('raw_data')
                }
                self.update_ui(ui_data)
                self.tabs.setCurrentIndex(0)
            else:
                QMessageBox.warning(self, "Error", "Failed to load details")

    def upload_file(self):
        options = QFileDialog.Options()
        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv);;All Files (*)", options=options)
        
        if file_path:
            self.upload_btn.setText("Uploading...")
            self.upload_btn.setEnabled(False)
            
            success, data = api_manager.upload_file(file_path)
            
            if success:
                self.update_ui(data)
                QMessageBox.information(self, "Success", "File analyzed successfully!")
            else:
                QMessageBox.critical(self, "Error", f"Upload failed: {data}")
            
            self.upload_btn.setText("📂 Upload CSV File")
            self.upload_btn.setEnabled(True)

    def update_ui(self, data):
        summary = data.get("summary", {})
        raw_data = data.get("raw_data", [])
        
        # 1. Update Labels
        self.lbl_total.setText(f"Total Equipment: {summary.get('total_count', '-')}")
        self.lbl_flow.setText(f"Avg Flowrate: {summary.get('avg_flowrate', '-')}")
        self.lbl_pressure.setText(f"Avg Pressure: {summary.get('avg_pressure', '-')}")
        self.lbl_temp.setText(f"Avg Temperature: {summary.get('avg_temperature', '-')}")

        # 2. Update Chart (Pie Chart with exact counts)
        type_dist = summary.get('type_distribution', {})
        self.canvas.axes.clear()
        if type_dist:
            labels = list(type_dist.keys())
            values = list(type_dist.values())
            # Display exact counts instead of percentages
            self.canvas.axes.pie(values, labels=labels, autopct=lambda pct: f'{int(pct/100.*sum(values))}', startangle=90)
            self.canvas.axes.set_title("Equipment Type Distribution")
            self.canvas.draw()
        
        # 3. Update Table
        if raw_data:
            columns = list(raw_data[0].keys())
            self.table.setColumnCount(len(columns))
            self.table.setHorizontalHeaderLabels(columns)
            self.table.setRowCount(len(raw_data))
            
            for row_idx, row_data in enumerate(raw_data):
                for col_idx, header in enumerate(columns):
                    item_val = str(row_data.get(header, ""))
                    self.table.setItem(row_idx, col_idx, QTableWidgetItem(item_val))
            
            header = self.table.horizontalHeader()
            header.setSectionResizeMode(QHeaderView.Stretch)
        else:
            self.table.setRowCount(0)

class ChemicalApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer (Desktop)")
        self.setGeometry(100, 100, 1000, 700)
        
        self.central_widget = QStackedWidget()
        self.setCentralWidget(self.central_widget)
        
        self.init_screens()
        
        # Apply global stylesheet
        self.setStyleSheet(STYLESHEET)

    def init_screens(self):
        self.login_screen = LoginWindow(self.switch_screen)
        self.register_screen = RegisterWindow(self.switch_screen)
        self.dashboard_screen = DashboardWindow(self.logout)
        
        self.central_widget.addWidget(self.login_screen)
        self.central_widget.addWidget(self.register_screen)
        self.central_widget.addWidget(self.dashboard_screen)
        
        self.central_widget.setCurrentWidget(self.login_screen)

    def switch_screen(self, screen_name):
        if screen_name == "login":
            self.central_widget.setCurrentWidget(self.login_screen)
        elif screen_name == "register":
            self.central_widget.setCurrentWidget(self.register_screen)
        elif screen_name == "dashboard":
            self.central_widget.setCurrentWidget(self.dashboard_screen)

    def logout(self):
        api_manager.set_token(None)
        self.switch_screen("login")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    
    window = ChemicalApp()
    window.show()
    sys.exit(app.exec_())