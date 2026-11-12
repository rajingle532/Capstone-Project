# ByteMed — Community-First Doctor-Patient Telehealth Platform

> **Capstone Project** | Developed by Omkar Ingle ([@rajingle532](https://github.com/rajingle532))

ByteMed is a collaborative telehealth and physician response platform designed to connect patients seeking medical guidance with verified healthcare professionals. The system combines natural language patient inquiry intake, automated clinical categorization, AI emergency safety triage, version-controlled medical advice, and real-time telehealth video rooms.

---

## 🌟 Key Features

### 1. Frictionless Patient Query Intake
* **Single-Paragraph Natural Language Description**: Patients don't need to guess medical specialties or craft clinical titles. They simply describe their symptoms in plain language.
* **AI Clinical Routing & Categorization**: The backend automatically classifies symptoms into appropriate specialties (*Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics, General*) and synthesizes a concise clinical summary title for doctors.
* **Real-Time Emergency Safety Triage**: Continuously scans for critical symptoms (*e.g., chest pain, stroke, unconsciousness, severe bleeding*) to immediately display emergency care guidance (911/112 direct links) without delaying life-saving treatment.
* **Diagnostic Attachments**: Support for symptom photos and lab reports.

### 2. Verified Physician Command Center & 8-Bit Plus Rank
* **8-Bit Plus Rank Contribution Model**: Translates the *Byte* concept into an 8-bit reputation system (Plus 1 `+` through Plus 8 `++++++++` Master Contributor), measuring peer contributions, patient helpfulness, and response quality without conflating reputation with clinical credentials.
* **Credential Verification Pipeline**: Multi-stage verification workflow (*Submitted → Under Board Review → Verified*).
* **Live Availability & Atomic Locking**: Doctors toggle live consultation availability with server-side atomic locking to prevent double-booking.

### 3. Version-Tracked Medical Advice
* **Immutable Revision Audit Log**: When doctors revise previous guidance, new versions (`v1.0`, `v2.0`) are recorded to maintain complete clinical auditability.
* **Patient Helpfulness Feedback**: Patients can submit star ratings to recognize helpful physician advice.

### 4. Interactive Telehealth Consultation Room
* **Real-time Video Feed**: WebRTC/media device stream with fallback animated avatar.
* **Live Clinical Notes Panel**: Integrated side drawer for documenting advice and prescription instructions during calls.
* **Safe Session Teardown**: Atomic reservation release upon consultation conclusion with post-call feedback modal.

### 5. Community Contribution Leaderboard
* Global ranking of verified physicians across specialty tiers, showing Plus Ranks, patient ratings, and live consultation availability.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, React Router 7, Axios
* **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT, BcryptJS
* **Architecture**: Modular Monolith with Event-driven Domain Design

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajingle532/Capsotone_Project.git
   cd Capsotone_Project
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   npm run seed   # Seeds demo accounts, queries, and verified doctors
   npm run dev    # Starts backend server on http://localhost:5000
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev    # Starts Vite dev server on http://localhost:5173
   ```

---

## 👥 Demo Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient.alice@bytemed.com` | `password123` | Patient account for asking queries |
| **Doctor (Master)** | `doctor.smith@bytemed.com` | `password123` | Dr. Eleanor Smith (Plus 8 Master, Live Available) |
| **Doctor (Pending)** | `doctor.pending@bytemed.com` | `password123` | Pending admin license verification flow |

---

## 📄 License
This project is developed for educational and academic capstone demonstration purposes.
