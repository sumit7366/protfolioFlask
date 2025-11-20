from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, send_file
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, User, Profile, Experience, Education, Project, Achievement, Technology
from config import Config
from datetime import datetime
import os
import json

app = Flask(__name__)
app.config.from_object(Config)



# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin_login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'svg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.context_processor
def inject_now():
    return {'now': datetime.now}
# Routes
@app.route('/')
def index():
    profile = Profile.query.first()
    experiences = Experience.query.order_by(Experience.order_index).all()
    education = Education.query.all()
    projects = Project.query.order_by(Project.order_index).all()
    achievements = Achievement.query.all()
    technologies = Technology.query.order_by(Technology.order_index).all()
    
    return render_template('index.html',
                         profile=profile,
                         experiences=experiences,
                         education=education,
                         projects=projects,
                         achievements=achievements,
                         technologies=technologies)

# Admin routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials')
    
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    profile = Profile.query.first()
    return render_template('admin/dashboard.html', profile=profile)

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

# API routes for admin
@app.route('/admin/api/profile', methods=['GET', 'POST'])
@login_required
def admin_profile():
    if request.method == 'POST':
        profile = Profile.query.first()
        if not profile:
            profile = Profile()
        
        profile.name = request.form.get('name')
        profile.title = request.form.get('title')
        profile.department = request.form.get('department')
        profile.bio = request.form.get('bio')
        profile.email = request.form.get('email')
        profile.phone = request.form.get('phone')
        profile.location = request.form.get('location')
        
        # Handle file uploads
        if 'profile_picture' in request.files:
            file = request.files['profile_picture']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                profile.profile_picture = filename
        
        if 'resume' in request.files:
            file = request.files['resume']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                profile.resume = filename
        
        if not Profile.query.first():
            db.session.add(profile)
        
        db.session.commit()
        return jsonify({'success': True})
    
    profile = Profile.query.first()
    return jsonify(profile.to_dict() if profile else {})

# Experience API
@app.route('/admin/api/experience', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_experience():
    if request.method == 'GET':
        experiences = Experience.query.order_by(Experience.order_index).all()
        return jsonify([exp.to_dict() for exp in experiences])
    
    elif request.method == 'POST':
        data = request.form.to_dict()
        
        if 'id' in data and data['id']:
            # Update existing
            item = Experience.query.get(data['id'])
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    if key == 'current':
                        setattr(item, key, value == 'true')
                    else:
                        setattr(item, key, value)
        else:
            # Create new
            data.pop('id', None)
            if 'current' in data:
                data['current'] = data['current'] == 'true'
            item = Experience(**data)
            db.session.add(item)
        
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('id')
        item = Experience.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'success': True})
        
        return jsonify({'error': 'Item not found'}), 404

# Projects API
@app.route('/admin/api/projects', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_projects():
    if request.method == 'GET':
        projects = Project.query.order_by(Project.order_index).all()
        return jsonify([project.to_dict() for project in projects])
    
    elif request.method == 'POST':
        data = request.form.to_dict()
        
        if 'id' in data and data['id']:
            # Update existing
            item = Project.query.get(data['id'])
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    if key == 'featured':
                        setattr(item, key, value == 'true')
                    else:
                        setattr(item, key, value)
        else:
            # Create new
            data.pop('id', None)
            if 'featured' in data:
                data['featured'] = data['featured'] == 'true'
            item = Project(**data)
            db.session.add(item)
        
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('id')
        item = Project.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'success': True})
        
        return jsonify({'error': 'Item not found'}), 404

# Technologies API
@app.route('/admin/api/technologies', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_technologies():
    if request.method == 'GET':
        technologies = Technology.query.order_by(Technology.order_index).all()
        return jsonify([tech.to_dict() for tech in technologies])
    
    elif request.method == 'POST':
        data = request.form.to_dict()
        
        if 'id' in data and data['id']:
            # Update existing
            item = Technology.query.get(data['id'])
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    setattr(item, key, value)
        else:
            # Create new
            data.pop('id', None)
            item = Technology(**data)
            db.session.add(item)
        
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('id')
        item = Technology.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'success': True})
        
        return jsonify({'error': 'Item not found'}), 404

# Education API
@app.route('/admin/api/education', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_education():
    if request.method == 'GET':
        education = Education.query.all()
        return jsonify([edu.to_dict() for edu in education])
    
    elif request.method == 'POST':
        data = request.form.to_dict()
        
        if 'id' in data and data['id']:
            # Update existing
            item = Education.query.get(data['id'])
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    if key == 'current':
                        setattr(item, key, value == 'true')
                    else:
                        setattr(item, key, value)
        else:
            # Create new
            data.pop('id', None)
            if 'current' in data:
                data['current'] = data['current'] == 'true'
            item = Education(**data)
            db.session.add(item)
        
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('id')
        item = Education.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'success': True})
        
        return jsonify({'error': 'Item not found'}), 404

# Achievements API
@app.route('/admin/api/achievements', methods=['GET', 'POST', 'DELETE'])
@login_required
def admin_achievements():
    if request.method == 'GET':
        achievements = Achievement.query.all()
        return jsonify([achievement.to_dict() for achievement in achievements])
    
    elif request.method == 'POST':
        data = request.form.to_dict()
        
        if 'id' in data and data['id']:
            # Update existing
            item = Achievement.query.get(data['id'])
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    setattr(item, key, value)
        else:
            # Create new
            data.pop('id', None)
            item = Achievement(**data)
            db.session.add(item)
        
        db.session.commit()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        item_id = request.args.get('id')
        item = Achievement.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({'success': True})
        
        return jsonify({'error': 'Item not found'}), 404

def create_tables():
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        if not User.query.first():
            admin = User(
                username='admin',
                password=generate_password_hash('admin123')
            )
            db.session.add(admin)
            
            # Create default profile
            if not Profile.query.first():
                profile = Profile(
                    name='Your Name',
                    title='Full Stack Developer',
                    department='Software Engineering',
                    bio='Welcome to my portfolio! I am a passionate developer with experience in modern web technologies. I love creating innovative solutions and learning new technologies.',
                    email='your.email@example.com',
                    phone='+1234567890',
                    location='Your City, Country'
                )
                db.session.add(profile)
            
            # Create sample data for demonstration
            if not Experience.query.first():
                sample_experience = Experience(
                    company='Sample Company',
                    position='Full Stack Developer',
                    start_date='Jan 2023',
                    end_date='Present',
                    current=True,
                    description='Developed and maintained web applications using modern technologies.',
                    order_index=0
                )
                db.session.add(sample_experience)
            
            if not Project.query.first():
                sample_project = Project(
                    title='Portfolio Website',
                    description='A responsive portfolio website built with Flask and modern frontend technologies.',
                    technologies='Python, Flask, HTML, CSS, JavaScript',
                    project_url='https://example.com',
                    github_url='https://github.com/example/portfolio',
                    featured=True,
                    order_index=0
                )
                db.session.add(sample_project)
            
            if not Technology.query.first():
                sample_technologies = [
                    Technology(name='Python', category='Backend', proficiency=5, icon='fab fa-python', order_index=0),
                    Technology(name='Flask', category='Backend', proficiency=4, icon='fas fa-flask', order_index=1),
                    Technology(name='JavaScript', category='Frontend', proficiency=4, icon='fab fa-js', order_index=2),
                    Technology(name='HTML5', category='Frontend', proficiency=5, icon='fab fa-html5', order_index=3),
                    Technology(name='CSS3', category='Frontend', proficiency=4, icon='fab fa-css3', order_index=4),
                ]
                for tech in sample_technologies:
                    db.session.add(tech)
            
            db.session.commit()
            print("✅ Database initialized successfully!")
            print("📝 Default admin credentials: username='admin', password='admin123'")
            print("🎯 Sample data created for demonstration")

if __name__ == '__main__':
    create_tables()
    print("🚀 Starting Flask application...")
    print("📧 Portfolio URL: http://localhost:5000")
    print("🔐 Admin Login: http://localhost:5000/admin/login")
    app.run(debug=True)