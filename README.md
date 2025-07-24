# SecureSight Dashboard

A comprehensive CCTV monitoring dashboard built for the SecureSight technical assessment. This application provides real-time incident monitoring, interactive timeline visualization, and 3D model showcases.

## 🚀 Features

### **Mandatory Features**
- **Incident Player**: Large video frame with camera controls and timestamps
- **Incident List**: Right-side panel showing incidents with thumbnails, severity indicators, and resolve functionality
- **Interactive Timeline**: 24-hour SVG timeline with draggable scrubber and incident markers
- **REST API**: Full CRUD operations for incidents and cameras

### **Optional Features**
- **3D Showcase**: React Three Fiber implementation with product models and animations
- **Real-time Camera Integration**: Live camera feeds with toggle controls
- **Optimistic UI**: Instant feedback for incident resolution

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MySQL2
- **Database**: MySQL
- **3D Graphics**: React Three Fiber, Three.js, @react-three/drei
- **Styling**: Tailwind CSS

## 🏗 Deployment Instructions

### Prerequisites
- Node.js 18+ 
- MySQL database (local, Docker, or cloud)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/priyanshu-101/securesight-dashboard.git
cd securesight-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
MYSQL_HOST=your_mysql_host
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=securesight_db
```

### 4. Database Setup
```bash
# Create database and tables
mysql -u your_user -p your_database < schema.sql

# Seed with sample data
npm run seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 6. Build for Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Incidents
- `GET /api/incidents?resolved=false` - Get incidents (filtered by resolved status)
- `PATCH /api/incidents/:id/resolve` - Toggle incident resolved status

## 🎯 Tech Decisions

### **Database Choice: MySQL**
- Chose MySQL for its robust relational capabilities and wide deployment support
- Used connection pooling for better performance under load
- Implemented proper foreign key relationships for data integrity

### **Frontend Architecture: Next.js App Router**
- App Router for better performance and developer experience
- Server-side rendering for improved SEO and initial load times
- TypeScript for better code quality and development experience

### **State Management: React Hooks**
- Used built-in React state management for simplicity
- Implemented optimistic UI updates for better user experience
- Custom hooks for reusable logic

### **3D Implementation: React Three Fiber**
- Chose R3F for seamless React integration
- Environment mapping and realistic lighting
- Responsive controls with OrbitControls

### **Styling: Tailwind CSS**
- Utility-first approach for rapid development
- Consistent design system
- Dark theme implementation for security monitoring context

## 📊 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── CameraView.tsx           # Main camera display
│   │   ├── IncidentsPanel.tsx       # Incident list sidebar
│   │   ├── InteractiveTimeline.tsx  # SVG timeline component
│   │   └── ProductModel.tsx         # 3D model components
│   ├── api/                 # API routes
│   │   └── incidents/       # Incident CRUD endpoints
│   ├── 3d/                  # 3D showcase page
│   └── page.tsx             # Main dashboard
├── lib/
│   └── mysql.ts             # Database configuration
└── scripts/
    └── seed.ts              # Database seeding script
```

## 🔮 If I Had More Time...

### **Enhanced Features**
- **Real-time WebSocket Updates**: Live incident streaming without refresh
- **Advanced Filtering**: Multi-criteria incident filtering (date range, severity, camera)
- **Dashboard Analytics**: Charts and statistics for incident trends
- **User Authentication**: Role-based access control for different user types
- **Mobile Responsiveness**: Optimized mobile layout for on-the-go monitoring

### **Performance Optimizations**
- **Database Indexing**: Optimize queries with proper indexes on timestamp and camera_id
- **Caching Layer**: Redis caching for frequently accessed incidents
- **Image Optimization**: Next.js Image component for thumbnail optimization
- **Virtual Scrolling**: Handle large incident lists efficiently
- **Service Worker**: Offline functionality for critical operations

### **Security Enhancements**
- **API Rate Limiting**: Prevent abuse of incident resolution endpoints
- **Input Validation**: Zod schemas for robust API validation
- **HTTPS Enforcement**: SSL certificates for secure communication
- **Database Encryption**: Encrypt sensitive incident data at rest
- **Audit Logging**: Track all incident modifications

### **Developer Experience**
- **Testing Suite**: Unit tests with Jest, E2E tests with Playwright
- **API Documentation**: OpenAPI/Swagger documentation
- **CI/CD Pipeline**: Automated testing and deployment
- **Error Monitoring**: Sentry integration for production error tracking
- **Performance Monitoring**: Real-time performance metrics

### **Advanced 3D Features**
- **Interactive Incident Visualization**: 3D heatmaps of incident locations
- **Building Layout Integration**: Import floor plans for spatial context
- **VR/AR Support**: Immersive incident investigation
- **Real-time Camera Positioning**: Live 3D representation of camera angles

## 🚀 Deployment

This project is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Docker containers**

For production deployment, ensure:
1. Environment variables are properly configured
2. Database is accessible from the hosting platform
3. Build optimization is enabled
4. HTTPS is enforced

## 📄 License


