# EcoDu Setup Guide

## Overview

EcoDu is a modern, interactive ecology education platform with full user authentication, video lessons, quizzes, commenting, and profile management.

## Features

### User Authentication
- Secure registration and login with Supabase
- Email/password authentication
- Session management
- Profile creation on signup

### User Profiles
- Customizable profile with name, bio, and avatar
- Upload and manage profile photos
- View personal statistics (videos watched, comments made, quizzes completed)
- Edit profile information

### Video Features
- Dynamic video player with YouTube embeds
- Like/unlike videos
- Comment on videos with real-time updates
- Delete your own comments
- View like counts and comment counts

### Quiz System
- Interactive quizzes for each video
- Multiple-choice questions
- Score tracking and history
- Immediate feedback on quiz completion
- Retake quizzes as many times as you want

### Modern UI/UX
- Professional, clean design
- Smooth animations and micro-interactions
- Fully responsive for all screen sizes
- Accessibility features
- Interactive hover effects

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The database is already configured with all necessary tables and sample data:

**Tables:**
- `profiles` - User profile information
- `videos` - Video content
- `video_likes` - Like tracking
- `comments` - Comment system
- `quizzes` - Quiz data
- `quiz_questions` - Quiz questions
- `quiz_options` - Answer options
- `quiz_attempts` - User quiz history

**Sample Data Included:**
- 5 ecology videos
- 5 quizzes with questions and answers
- Proper security policies (RLS enabled)

### 4. Development

```bash
npm run dev
```

This starts the development server on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## File Structure

```
ecodu/
├── index.html              # Homepage
├── video.html              # Video player page
├── profile.html            # User profile page
├── login.html              # Login page
├── register.html           # Registration page
├── style.css               # Main stylesheet
├── video-enhanced.css      # Video page styles
├── profile.css             # Profile page styles
├── register.css            # Auth pages styles
├── watch-video.css         # Video player styles
├── script.js               # Homepage scripts
├── video.js                # Video page functionality
├── profile.js              # Profile management
├── login.js                # Login functionality
├── register.js             # Registration functionality
├── index-auth.js           # Homepage auth integration
├── auth.js                 # Auth utilities
├── supabase-client.js      # Supabase client setup
├── package.json            # Dependencies
├── vite.config.js          # Build configuration
└── .env                    # Environment variables
```

## Key Features Detail

### Authentication Flow
1. Users register with email, password, and name
2. Profile automatically created in database
3. Login redirects to homepage with authenticated state
4. Profile accessible from navigation menu

### Video Interaction
1. Click any video from homepage
2. Watch video with embedded YouTube player
3. Like button toggles like/unlike
4. Comment section below video
5. Take quiz button appears if quiz available

### Quiz Experience
1. Click "Take Quiz" button
2. Answer multiple-choice questions
3. Submit to see score
4. Results saved to profile
5. Option to retake quiz

### Profile Management
1. View your profile stats
2. Edit name and bio
3. Upload profile picture
4. View quiz history
5. Logout option

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only modify their own data
- Public content viewable by everyone
- Authentication required for interactions

## Technologies Used

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Authentication
- **Storage:** Supabase Storage (for avatars)
- **Build Tool:** Vite
- **Video:** YouTube Embed API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized asset loading
- Lazy loading for images
- Minified CSS and JS in production
- CDN for external libraries
- Efficient database queries with indexes

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

## Future Enhancements

Consider adding:
- Search functionality
- Video categories
- User achievements/badges
- Social sharing
- Email notifications
- Admin dashboard
- Video upload capability
- Live chat
- Leaderboards

## Support

For issues or questions, please check the codebase or contact the development team.

## License

All rights reserved © 2025 EcoDu
