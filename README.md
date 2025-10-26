# Trinity

A modern, responsive React website built with Vite and ready for deployment on GitHub Pages.

## Features

- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern Design** - Clean, responsive UI with smooth animations
- 💅 **SCSS Styling** - Powered by SCSS with variables, mixins, and nesting
- 🌙 **Dark Mode** - Automatic dark mode based on system preferences
- 🚀 **Easy Deployment** - One-command deployment to GitHub Pages

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Trinity.git
cd Trinity
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deploying to GitHub Pages

### Method 1: Manual Deployment

1. Update the `base` in `vite.config.js` to match your repository name:
```javascript
base: '/YOUR-REPO-NAME/',
```

2. Run the deploy command:
```bash
npm run deploy
```

This will build your site and push it to the `gh-pages` branch.

### Method 2: Automatic Deployment with GitHub Actions

The project includes a GitHub Actions workflow that automatically deploys your site when you push to the `main` branch.

**Setup Steps:**

1. Go to your GitHub repository settings
2. Navigate to **Settings > Pages**
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   
4. Update the `base` in `vite.config.js` to match your repository name:
```javascript
base: '/YOUR-REPO-NAME/',
```

5. Commit and push your changes to the `main` branch:
```bash
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy your site. You can monitor the deployment progress in the **Actions** tab of your repository.

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/`

## Project Structure

```
Trinity/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── vite.svg               # Public assets
├── src/
│   ├── App.jsx                # Main App component
│   ├── App.scss               # App styles with SCSS
│   ├── main.jsx               # Entry point
│   └── index.scss             # Global styles with SCSS
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## Customization

### Change Colors

Edit the SCSS variables in `src/App.scss`:
```scss
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$primary-color: #667eea;
$secondary-color: #764ba2;
```

### Modify Content

Edit the content in `src/App.jsx` to customize the hero section, features, and other content.

### SCSS Features

The project uses SCSS with:
- **Variables** for colors and breakpoints
- **Mixins** for reusable styles
- **Nesting** for cleaner code
- **BEM-style** class naming

### Add Pages

To add more pages/routes, consider installing React Router:
```bash
npm install react-router-dom
```

## Technologies Used

- [React 18](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [SCSS](https://sass-lang.com/) - CSS preprocessor
- [GitHub Pages](https://pages.github.com/) - Hosting

## License

MIT License - feel free to use this template for your own projects!

## Support

If you have any questions or issues, please open an issue on GitHub.

---

Built with ❤️ using React + Vite

