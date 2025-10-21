# electron-shadcn Project Overview

## Project Description

The electron-shadcn project is an Electron desktop application template that combines modern web technologies including React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. It serves as a starter template for building cross-platform desktop applications using web technologies, with built-in support for internationalization, theme switching, and Electron-specific features.

## Architecture

The project follows a modern architecture using:
- **Electron**: For desktop application functionality
- **React 19**: As the frontend framework
- **TypeScript**: For type safety
- **Vite**: As the build tool and development server
- **Tailwind CSS**: For styling with custom configuration
- **shadcn/ui**: For accessible UI components
- **TanStack Router**: For routing functionality
- **Electron Forge**: For packaging and distribution

### File Structure
- `src/main.ts`: Electron main process entry point
- `src/preload.ts`: Preload script for secure IPC communication
- `src/renderer.ts`: React application entry point
- `src/App.tsx`: Root React component
- `src/routes/`: TanStack Router route components
- `src/components/`: React components, including shadcn/ui components
- `src/helpers/`: Utility functions for theme, language, and IPC
- `src/layouts/`: Layout components
- `src/styles/`: Global styles and Tailwind configuration
- `public/`: Static assets
- `src/assets/`: Application-specific assets (fonts, icons)

## Building and Running

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Commands
- `npm start`: Start the development server with hot reload
- `npm run package`: Package the application for the current platform
- `npm run make`: Create distributable installers for the application
- `npm run lint`: Lint the codebase using ESLint
- `npm run format`: Check code formatting
- `npm run format:write`: Apply formatting to the codebase
- `npm test`: Run unit tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:e2e`: Run end-to-end tests with Playwright

### Development Server
The development environment uses Vite with Electron Forge to provide fast reloading. The application automatically installs React Developer Tools in development mode.

### Production Build
The application uses Electron Forge with the Vite plugin to build and package the application for distribution. Different platform-specific installers (Squirrel for Windows, ZIP for macOS, DEB/RPM for Linux) are generated.

## Development Conventions

### Code Style
- TypeScript is used throughout the project for type safety
- ESLint and Prettier are configured for code quality and formatting
- The code follows React best practices and hooks conventions
- Tailwind CSS utility classes are used for styling
- Component names follow PascalCase
- File names match component names (e.g., `Button.tsx`)

### Component Structure
- Components are located in the `src/components` directory
- shadcn/ui components are in the `src/components/ui` subdirectory
- Custom components are in the main `components` directory or in subdirectories
- Components use TypeScript interfaces for props
- Components are functional with React hooks

### Routing
- TanStack Router is used for routing
- Route files are generated in the `src/routes` directory
- Route components use the `createFileRoute` function
- The route tree is automatically generated in `routeTree.gen.ts`

### Styling
- Tailwind CSS is used with custom configuration in `components.json`
- CSS variables are defined in `src/styles/global.css` for theme customization
- Custom themes are supported with dark/light mode
- Font faces are defined in the global CSS file
- shadcn/ui components are styled using Tailwind classes

### Internationalization
- i18next is used for internationalization
- Language helpers are in `src/helpers/language_helpers`
- Translation files are in the `src/localization` directory

### Theme Management
- Theme switching is implemented using helper functions in `src/helpers/theme_helpers`
- The ToggleTheme component allows users to switch between light/dark/system themes
- Theme preferences are stored in localStorage
- CSS variables are used to implement theme changes

### IPC Communication
- Secure IPC communication between main and renderer processes
- IPC helpers are in the `src/helpers/ipc` directory
- Context Bridge is used to safely expose main process functionality

### Testing
- Unit tests can be run with Vitest
- End-to-end tests can be run with Playwright
- Testing libraries include React Testing Library and Jest DOM

## Key Features

1. **Cross-platform Desktop Application**: Built with Electron for Windows, macOS, and Linux
2. **Modern Web Stack**: Uses React 19, TypeScript, and Vite
3. **Component Library**: Includes shadcn/ui components with custom styling
4. **Theming**: Supports light/dark mode with automatic system theme detection
5. **Internationalization**: Built-in i18n support
6. **Responsive Design**: Uses Tailwind CSS for responsive layouts
7. **Type Safety**: Full TypeScript integration
8. **Secure IPC**: Properly configured context isolation and IPC
9. **Development Tools**: Includes React DevTools in development
10. **Packaging**: Electron Forge configuration for easy distribution

## Configuration Files

- `package.json`: Contains dependencies, scripts, and project metadata
- `forge.config.ts`: Electron Forge configuration for building and packaging
- `vite.*.config.mts`: Vite configurations for main, renderer, and preload processes
- `tsconfig.json`: TypeScript configuration
- `components.json`: shadcn/ui configuration
- `tailwind.config.js` (inferred): Tailwind CSS configuration
- `.prettierrc`: Prettier code formatting configuration
- `eslint.config.mjs`: ESLint configuration

## Assets

The application includes custom fonts (Geist, Geist Mono, Tomorrow) and supports custom icons. The development currently has a process.exit() statement in main.ts that needs to be removed for the application to run properly.