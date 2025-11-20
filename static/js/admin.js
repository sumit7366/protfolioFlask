class AdminPanel {
    constructor() {
        this.currentTab = 'profile';
        this.editingItem = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAllData();
        this.showTab('profile');
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.showTab(tab);
            });
        });

        // Form submissions
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Modal form submissions
        document.getElementById('experienceForm')?.addEventListener('submit', (e) => this.saveExperience(e));
        document.getElementById('projectForm')?.addEventListener('submit', (e) => this.saveProject(e));
        document.getElementById('technologyForm')?.addEventListener('submit', (e) => this.saveTechnology(e));
        document.getElementById('educationForm')?.addEventListener('submit', (e) => this.saveEducation(e));
        document.getElementById('achievementForm')?.addEventListener('submit', (e) => this.saveAchievement(e));

        // Modal events
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Admin login modal
        document.querySelector('.copyright')?.addEventListener('click', () => {
            this.openAdminModal();
        });

        document.querySelector('.close-modal')?.addEventListener('click', () => {
            this.closeAdminModal();
        });

        document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Activate corresponding nav item
        const targetNavItem = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        this.currentTab = tabName;

        // Load tab-specific data
        if (tabName !== 'profile' && tabName !== 'preview') {
            this.loadTabData(tabName);
        }

        // Refresh preview iframe
        if (tabName === 'preview') {
            const iframe = document.getElementById('livePreview');
            if (iframe) {
                iframe.src = iframe.src;
            }
        }
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadExperiences(),
                this.loadProjects(),
                this.loadTechnologies(),
                this.loadEducation(),
                this.loadAchievements()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showMessage('Error loading data', 'error');
        }
    }

    async loadTabData(tabName) {
        switch (tabName) {
            case 'experience':
                await this.loadExperiences();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'technologies':
                await this.loadTechnologies();
                break;
            case 'education':
                await this.loadEducation();
                break;
            case 'achievements':
                await this.loadAchievements();
                break;
        }
    }

    async saveProfile() {
        const form = document.getElementById('profileForm');
        const formData = new FormData(form);

        try {
            const response = await fetch('/admin/api/profile', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Profile updated successfully!', 'success');
                // Update preview
                const iframe = document.getElementById('livePreview');
                if (iframe) {
                    iframe.src = iframe.src;
                }
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showMessage('Error updating profile', 'error');
        }
    }

    async loadExperiences() {
        try {
            const response = await fetch('/admin/api/experience');
            const experiences = await response.json();
            this.renderExperiences(experiences);
        } catch (error) {
            console.error('Error loading experiences:', error);
        }
    }

    renderExperiences(experiences) {
        const container = document.getElementById('experienceList');
        if (!container) return;

        container.innerHTML = experiences.map(exp => `
            <div class="item-card" data-id="${exp.id}">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-subtitle">${exp.company}</div>
                        <div class="item-date">${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}</div>
                    </div>
                    <div class="item-actions">
                        <button class="item-action edit" onclick="adminPanel.editExperience(${exp.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-action delete" onclick="adminPanel.deleteItem('experience', ${exp.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="item-description">${exp.description || ''}</div>
            </div>
        `).join('');
    }

    async loadProjects() {
        try {
            const response = await fetch('/admin/api/projects');
            const projects = await response.json();
            this.renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    renderProjects(projects) {
        const container = document.getElementById('projectsList');
        if (!container) return;

        container.innerHTML = projects.map(project => `
            <div class="item-card" data-id="${project.id}">
                <div class="item-header">
                    <div>
                        <div class="item-title">${project.title}</div>
                        <div class="item-subtitle">Technologies: ${project.technologies || 'Not specified'}</div>
                    </div>
                    <div class="item-actions">
                        <button class="item-action edit" onclick="adminPanel.editProject(${project.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-action delete" onclick="adminPanel.deleteItem('projects', ${project.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="item-description">${project.description}</div>
                <div class="item-links">
                    ${project.project_url ? `<a href="${project.project_url}" target="_blank">Live Demo</a>` : ''}
                    ${project.github_url ? `<a href="${project.github_url}" target="_blank">GitHub</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadTechnologies() {
        try {
            const response = await fetch('/admin/api/technologies');
            const technologies = await response.json();
            this.renderTechnologies(technologies);
        } catch (error) {
            console.error('Error loading technologies:', error);
        }
    }

    renderTechnologies(technologies) {
        const container = document.getElementById('technologiesList');
        if (!container) return;

        container.innerHTML = technologies.map(tech => `
            <div class="tech-card" data-id="${tech.id}">
                <div class="tech-icon">
                    <i class="${tech.icon || 'fas fa-code'}"></i>
                </div>
                <div class="tech-name">${tech.name}</div>
                <div class="tech-category">${tech.category || 'Uncategorized'}</div>
                <div class="tech-proficiency">
                    ${Array.from({length: 5}, (_, i) => 
                        `<div class="proficiency-dot ${i < (tech.proficiency || 3) ? 'active' : ''}"></div>`
                    ).join('')}
                </div>
                <div class="item-actions" style="margin-top: 1rem;">
                    <button class="item-action edit" onclick="adminPanel.editTechnology(${tech.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action delete" onclick="adminPanel.deleteItem('technologies', ${tech.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadEducation() {
        try {
            const response = await fetch('/admin/api/education');
            const education = await response.json();
            this.renderEducation(education);
        } catch (error) {
            console.error('Error loading education:', error);
        }
    }

    renderEducation(education) {
        const container = document.getElementById('educationList');
        if (!container) return;

        container.innerHTML = education.map(edu => `
            <div class="item-card" data-id="${edu.id}">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-subtitle">${edu.institution}</div>
                        <div class="item-date">${edu.start_date} - ${edu.current ? 'Present' : edu.end_date}</div>
                    </div>
                    <div class="item-actions">
                        <button class="item-action edit" onclick="adminPanel.editEducation(${edu.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-action delete" onclick="adminPanel.deleteItem('education', ${edu.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="item-description">${edu.field || ''}</div>
                ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
            </div>
        `).join('');
    }

    async loadAchievements() {
        try {
            const response = await fetch('/admin/api/achievements');
            const achievements = await response.json();
            this.renderAchievements(achievements);
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    renderAchievements(achievements) {
        const container = document.getElementById('achievementsList');
        if (!container) return;

        container.innerHTML = achievements.map(achievement => `
            <div class="item-card" data-id="${achievement.id}">
                <div class="item-header">
                    <div>
                        <div class="item-title">${achievement.title}</div>
                        <div class="item-subtitle">${achievement.issuer || 'Not specified'}</div>
                        <div class="item-date">${achievement.date || 'No date'}</div>
                    </div>
                    <div class="item-actions">
                        <button class="item-action edit" onclick="adminPanel.editAchievement(${achievement.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-action delete" onclick="adminPanel.deleteItem('achievements', ${achievement.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="item-description">${achievement.description || ''}</div>
            </div>
        `).join('');
    }

    // Modal functions
    openExperienceModal(experience = null) {
        this.editingItem = experience;
        const modal = document.getElementById('experienceModal');
        const form = document.getElementById('experienceForm');
        const title = document.getElementById('experienceModalTitle');
        
        if (title) {
            title.textContent = experience ? 'Edit Experience' : 'Add Experience';
        }
        
        if (experience && form) {
            // Fill form with existing data
            Object.keys(experience).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = experience[key];
                    } else {
                        input.value = experience[key] || '';
                    }
                }
            });
        } else if (form) {
            form.reset();
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    openProjectModal(project = null) {
        this.editingItem = project;
        const modal = document.getElementById('projectModal');
        const form = document.getElementById('projectForm');
        const title = document.getElementById('projectModalTitle');
        
        if (title) {
            title.textContent = project ? 'Edit Project' : 'Add Project';
        }
        
        if (project && form) {
            Object.keys(project).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = project[key];
                    } else {
                        input.value = project[key] || '';
                    }
                }
            });
        } else if (form) {
            form.reset();
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    openTechnologyModal(technology = null) {
        this.editingItem = technology;
        const modal = document.getElementById('technologyModal');
        const form = document.getElementById('technologyForm');
        const title = document.getElementById('technologyModalTitle');
        
        if (title) {
            title.textContent = technology ? 'Edit Technology' : 'Add Technology';
        }
        
        if (technology && form) {
            Object.keys(technology).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = technology[key] || '';
                }
            });
        } else if (form) {
            form.reset();
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    openEducationModal(education = null) {
        this.editingItem = education;
        const modal = document.getElementById('educationModal');
        const form = document.getElementById('educationForm');
        const title = document.getElementById('educationModalTitle');
        
        if (title) {
            title.textContent = education ? 'Edit Education' : 'Add Education';
        }
        
        if (education && form) {
            Object.keys(education).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = education[key];
                    } else {
                        input.value = education[key] || '';
                    }
                }
            });
        } else if (form) {
            form.reset();
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    openAchievementModal(achievement = null) {
        this.editingItem = achievement;
        const modal = document.getElementById('achievementModal');
        const form = document.getElementById('achievementForm');
        const title = document.getElementById('achievementModalTitle');
        
        if (title) {
            title.textContent = achievement ? 'Edit Achievement' : 'Add Achievement';
        }
        
        if (achievement && form) {
            Object.keys(achievement).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = achievement[key] || '';
                }
            });
        } else if (form) {
            form.reset();
        }
        
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.editingItem = null;
    }

    // Save methods for each model
    async saveExperience(event) {
        event.preventDefault();
        const form = document.getElementById('experienceForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/admin/api/experience', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Experience saved successfully!', 'success');
                this.closeAllModals();
                this.loadExperiences();
            } else {
                throw new Error('Failed to save experience');
            }
        } catch (error) {
            console.error('Error saving experience:', error);
            this.showMessage('Error saving experience', 'error');
        }
    }

    async saveProject(event) {
        event.preventDefault();
        const form = document.getElementById('projectForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/admin/api/projects', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Project saved successfully!', 'success');
                this.closeAllModals();
                this.loadProjects();
            } else {
                throw new Error('Failed to save project');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            this.showMessage('Error saving project', 'error');
        }
    }

    async saveTechnology(event) {
        event.preventDefault();
        const form = document.getElementById('technologyForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/admin/api/technologies', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Technology saved successfully!', 'success');
                this.closeAllModals();
                this.loadTechnologies();
            } else {
                throw new Error('Failed to save technology');
            }
        } catch (error) {
            console.error('Error saving technology:', error);
            this.showMessage('Error saving technology', 'error');
        }
    }

    async saveEducation(event) {
        event.preventDefault();
        const form = document.getElementById('educationForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/admin/api/education', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Education saved successfully!', 'success');
                this.closeAllModals();
                this.loadEducation();
            } else {
                throw new Error('Failed to save education');
            }
        } catch (error) {
            console.error('Error saving education:', error);
            this.showMessage('Error saving education', 'error');
        }
    }

    async saveAchievement(event) {
        event.preventDefault();
        const form = document.getElementById('achievementForm');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/admin/api/achievements', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Achievement saved successfully!', 'success');
                this.closeAllModals();
                this.loadAchievements();
            } else {
                throw new Error('Failed to save achievement');
            }
        } catch (error) {
            console.error('Error saving achievement:', error);
            this.showMessage('Error saving achievement', 'error');
        }
    }

    // Edit methods
    async editExperience(id) {
        try {
            const response = await fetch('/admin/api/experience');
            const experiences = await response.json();
            const experience = experiences.find(exp => exp.id === id);
            
            if (experience) {
                this.openExperienceModal(experience);
            }
        } catch (error) {
            console.error('Error loading experience:', error);
            this.showMessage('Error loading experience', 'error');
        }
    }

    async editProject(id) {
        try {
            const response = await fetch('/admin/api/projects');
            const projects = await response.json();
            const project = projects.find(proj => proj.id === id);
            
            if (project) {
                this.openProjectModal(project);
            }
        } catch (error) {
            console.error('Error loading project:', error);
            this.showMessage('Error loading project', 'error');
        }
    }

    async editTechnology(id) {
        try {
            const response = await fetch('/admin/api/technologies');
            const technologies = await response.json();
            const technology = technologies.find(tech => tech.id === id);
            
            if (technology) {
                this.openTechnologyModal(technology);
            }
        } catch (error) {
            console.error('Error loading technology:', error);
            this.showMessage('Error loading technology', 'error');
        }
    }

    async editEducation(id) {
        try {
            const response = await fetch('/admin/api/education');
            const education = await response.json();
            const edu = education.find(ed => ed.id === id);
            
            if (edu) {
                this.openEducationModal(edu);
            }
        } catch (error) {
            console.error('Error loading education:', error);
            this.showMessage('Error loading education', 'error');
        }
    }

    async editAchievement(id) {
        try {
            const response = await fetch('/admin/api/achievements');
            const achievements = await response.json();
            const achievement = achievements.find(ach => ach.id === id);
            
            if (achievement) {
                this.openAchievementModal(achievement);
            }
        } catch (error) {
            console.error('Error loading achievement:', error);
            this.showMessage('Error loading achievement', 'error');
        }
    }

    async deleteItem(model, id) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`/admin/api/${model}?id=${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('Item deleted successfully!', 'success');
                this.loadTabData(this.currentTab);
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            this.showMessage('Error deleting item', 'error');
        }
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Remove any existing messages
        document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());

        // Add new message
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.insertBefore(messageDiv, activeTab.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Admin modal functions
    openAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeAdminModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleAdminLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const messageDiv = document.getElementById('modalMessage');

        if (!usernameInput || !passwordInput || !messageDiv) return;

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Simple client-side check (in production, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            window.location.href = '/admin/dashboard';
        } else {
            messageDiv.textContent = 'Invalid credentials!';
            messageDiv.style.color = 'red';
        }
    }
}

// Global functions for modal opening
function openExperienceModal() {
    if (adminPanel) {
        adminPanel.openExperienceModal();
    }
}

function openProjectModal() {
    if (adminPanel) {
        adminPanel.openProjectModal();
    }
}

function openTechnologyModal() {
    if (adminPanel) {
        adminPanel.openTechnologyModal();
    }
}

function openEducationModal() {
    if (adminPanel) {
        adminPanel.openEducationModal();
    }
}

function openAchievementModal() {
    if (adminPanel) {
        adminPanel.openAchievementModal();
    }
}

function saveAllChanges() {
    if (adminPanel) {
        adminPanel.showMessage('All changes saved successfully!', 'success');
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});