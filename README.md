# Portfolio Website

A responsive, full-featured portfolio website built with **Flask** and modern web technologies. This application includes an admin dashboard for managing your portfolio content including experience, education, projects, achievements, and technologies.

## Features

- 🎨 **Responsive Design** - Mobile-friendly portfolio that looks great on all devices
- 🔐 **Admin Dashboard** - Secure admin panel for managing portfolio content
- 📝 **Content Management** - Easily manage:
  - Profile information (name, title, bio, contact details)
  - Work experience
  - Education history
  - Projects showcase
  - Achievements and awards
  - Technology skills
- 📤 **File Uploads** - Support for profile pictures and resume uploads
- 🗄️ **Database** - SQLite database for persistent data storage
- 🎯 **Drag & Drop Ordering** - Organize sections with custom ordering
- 💾 **RESTful API** - Backend API endpoints for all content management

## Tech Stack

- **Backend**: Python, Flask
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3, JavaScript
- **Authentication**: Flask-Login
- **Security**: Werkzeug password hashing

## Project Structure

```
portfolio/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── static/
│   ├── css/             # Stylesheets
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/              # JavaScript files
│   │   ├── main.js
│   │   ├── admin.js
│   │   └── particles.js
│   └── uploads/         # User uploaded files
└── templates/
    ├── index.html       # Main portfolio page
    ├── base.html        # Base template
    ├── admin/           # Admin templates
    │   ├── login.html
    │   ├── dashboard.html
    │   └── modals/
    │       ├── achievement_modal.html
    │       ├── education_modal.html
    │       ├── experience_modal.html
    │       ├── project_modal.html
    │       └── technology_modal.html
    └── components/      # Reusable components
        ├── header.html
        └── footer.html
```

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Setup Instructions

1. **Clone or download the project**
   ```bash
   cd portfolio
   ```

2. **Create and activate a virtual environment**
   
   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the portfolio**
   - Portfolio: http://localhost:5000
   - Admin Login: http://localhost:5000/admin/login
   - Default credentials:
     - Username: `admin`
     - Password: `admin123`

**⚠️ Important**: Change the default password immediately after first login!

## Configuration

Edit `config.py` to customize:

```python
# Database location
SQLALCHEMY_DATABASE_URI = 'sqlite:///portfolio.db'

# Secret key for sessions (change in production)
SECRET_KEY = 'your-secret-key-change-in-production'

# Upload folder for files
UPLOAD_FOLDER = 'static/uploads'

# Maximum upload size (in bytes)
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
```

## Usage

### Admin Dashboard

1. Login at `/admin/login`
2. Manage your portfolio sections:
   - **Profile**: Update personal information and upload profile picture/resume
   - **Experience**: Add work experience entries
   - **Education**: Add educational background
   - **Projects**: Showcase your projects with descriptions and links
   - **Technologies**: List your technical skills with proficiency levels
   - **Achievements**: Highlight awards and certifications

### API Endpoints

All endpoints require authentication (except `/` and `/admin/login`):

- `GET /` - View portfolio
- `POST /admin/login` - Admin login
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/logout` - Logout
- `GET/POST /admin/api/profile` - Profile management
- `GET/POST/DELETE /admin/api/experience` - Experience management
- `GET/POST/DELETE /admin/api/education` - Education management
- `GET/POST/DELETE /admin/api/projects` - Projects management
- `GET/POST/DELETE /admin/api/technologies` - Technologies management
- `GET/POST/DELETE /admin/api/achievements` - Achievements management

## Deployment Guide

### Option 1: Heroku (Free/Paid)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Create Procfile** in project root:
   ```
   web: gunicorn app:app
   ```

5. **Update requirements.txt**
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Initialize database**
   ```bash
   heroku run python app.py
   ```

8. **Access your app**
   ```
   https://your-app-name.herokuapp.com
   ```

---

### Option 2: PythonAnywhere (Free/Paid)

1. **Sign up** at https://www.pythonanywhere.com

2. **Upload your project**
   - Use the web interface to upload files or clone from GitHub

3. **Create a web app**
   - Click "Add a new web app"
   - Choose "Flask"
   - Select Python version 3.8+

4. **Configure WSGI file**
   Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`:
   ```python
   import sys
   path = '/home/yourusername/mysite'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```

5. **Install packages**
   ```bash
   mkvirtualenv --python=/usr/bin/python3.8 mysite
   pip install -r requirements.txt
   ```

6. **Set up database**
   - Use the Bash console to run `python app.py`

7. **Reload web app** and access at `https://yourusername.pythonanywhere.com`

---

### Option 3: Railway.app (Free/Paid)

1. **Sign up** at https://railway.app

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   # or
   brew install railway
   ```

3. **Login**
   ```bash
   railway login
   ```

4. **Initialize project**
   ```bash
   railway init
   ```

5. **Add environment variables**
   ```bash
   railway variables
   # Set FLASK_ENV=production
   # Set SECRET_KEY=your-secret-key
   ```

6. **Create Procfile**
   ```
   web: gunicorn app:app
   ```

7. **Deploy**
   ```bash
   railway up
   ```

---

### Option 4: Render (Free/Paid)

1. **Sign up** at https://render.com

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn app:app`

3. **Add environment variables**
   - `FLASK_ENV`: production
   - `SECRET_KEY`: your-secret-key

4. **Deploy**
   - Render automatically deploys on push

---

### Option 5: AWS (Free tier available)

#### Using Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   eb init -p python-3.9 my-portfolio
   ```

3. **Create Procfile**
   ```
   web: gunicorn app:app
   ```

4. **Create environment and deploy**
   ```bash
   eb create my-env
   eb deploy
   ```

5. **Open application**
   ```bash
   eb open
   ```

---

### Option 6: DigitalOcean (Paid - $5/month)

1. **Create a Droplet**
   - Choose Ubuntu 20.04 LTS
   - Select $5/month option

2. **SSH into droplet**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install dependencies**
   ```bash
   apt update && apt upgrade -y
   apt install python3-pip python3-venv nginx -y
   ```

4. **Clone your project**
   ```bash
   git clone your-repo-url
   cd portfolio
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt gunicorn
   ```

5. **Create systemd service** (`/etc/systemd/system/portfolio.service`):
   ```
   [Unit]
   Description=Portfolio Flask App
   After=network.target
   
   [Service]
   User=root
   WorkingDirectory=/root/portfolio
   ExecStart=/root/portfolio/venv/bin/gunicorn app:app
   
   [Install]
   WantedBy=multi-user.target
   ```

6. **Start service**
   ```bash
   systemctl start portfolio
   systemctl enable portfolio
   ```

7. **Configure Nginx** (`/etc/nginx/sites-available/portfolio`):
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;
   
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

8. **Enable Nginx**
   ```bash
   ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

---

### Option 7: Docker + Any Cloud Provider

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["gunicorn", "app:app"]
   ```

2. **Create .dockerignore**
   ```
   venv/
   __pycache__/
   *.pyc
   .git
   .env
   ```

3. **Build Docker image**
   ```bash
   docker build -t portfolio:latest .
   ```

4. **Run locally**
   ```bash
   docker run -p 5000:5000 portfolio:latest
   ```

5. **Deploy to cloud**
   - Push to Docker Hub and deploy to AWS ECS
   - Push to Google Container Registry and deploy to Cloud Run
   - Push to Azure Container Registry and deploy to App Service

---

## Environment Variables

For production deployment, set these environment variables:

```bash
FLASK_ENV=production
SECRET_KEY=your-secure-random-key
DATABASE_URL=your-database-connection-string (optional, defaults to SQLite)
```

Generate a secure secret key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Security Best Practices

1. **Change default password** immediately after setup
2. **Use strong SECRET_KEY** in production
3. **Enable HTTPS** on all deployments
4. **Validate and sanitize** all user inputs
5. **Keep dependencies updated** regularly
6. **Use environment variables** for sensitive data
7. **Implement rate limiting** for login attempts
8. **Regular backups** of your database

## Troubleshooting

### Port 5000 already in use
```bash
# macOS/Linux - Find and kill process
lsof -ti:5000 | xargs kill -9

# Or use different port
python app.py --port 8000
```

### Database errors
```bash
# Remove old database
rm portfolio.db

# Reinitialize
python app.py
```

### Module not found errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Database locked errors
- Close all connections to the database
- Ensure only one instance is running
- For production, use PostgreSQL instead of SQLite

## Database Management

### Backup your database
```bash
cp portfolio.db portfolio.db.backup
```

### Export data as JSON
```python
# Add this to app.py and run as needed
import json
from models import db, Profile, Experience, Education, Project, Achievement, Technology

def export_data():
    data = {
        'profile': Profile.query.first().to_dict() if Profile.query.first() else None,
        'experiences': [e.to_dict() for e in Experience.query.all()],
        'education': [e.to_dict() for e in Education.query.all()],
        'projects': [p.to_dict() for p in Project.query.all()],
        'achievements': [a.to_dict() for a in Achievement.query.all()],
        'technologies': [t.to_dict() for t in Technology.query.all()],
    }
    with open('portfolio_data.json', 'w') as f:
        json.dump(data, f, indent=2)
```

## Production Checklist

- [ ] Change default admin password
- [ ] Set `FLASK_ENV=production`
- [ ] Generate and set secure `SECRET_KEY`
- [ ] Enable HTTPS/SSL
- [ ] Configure custom domain name
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Set up monitoring and alerts
- [ ] Configure database (PostgreSQL recommended)
- [ ] Set up CDN for static files
- [ ] Enable CORS if needed
- [ ] Test all functionality

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review configuration in `config.py`
3. Check Flask documentation: https://flask.palletsprojects.com/
4. Check SQLAlchemy documentation: https://www.sqlalchemy.org/

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Happy hosting! 🚀**
