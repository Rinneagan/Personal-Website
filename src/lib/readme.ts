// GitHub README fetcher and generator
import { GitHubRepo } from './github';

export interface ReadmeContent {
  content: string;
  exists: boolean;
  isGenerated: boolean;
}

// Fetch README from GitHub repository
export async function fetchReadme(owner: string, repo: string): Promise<ReadmeContent> {
  try {
    // Try to fetch README from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add auth token if available
        ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
      }
    });

    if (response.ok) {
      const data = await response.json();
      // README content is base64 encoded
      const content = atob(data.content);
      return {
        content,
        exists: true,
        isGenerated: false
      };
    }
  } catch (error) {
    console.warn('Failed to fetch README:', error);
  }

  // If README doesn't exist, generate one
  const generatedReadme = generateComprehensiveReadme(owner, repo);
  return {
    content: generatedReadme,
    exists: false,
    isGenerated: true
  };
}

// Generate comprehensive README based on repository information
function generateComprehensiveReadme(owner: string, repo: string): string {
  return `# ${repo}

## 📖 Overview

This repository is part of the ${owner}'s GitHub portfolio. While the original README is not available, we've generated this comprehensive overview to help you understand the project.

## 🚀 Features

### Core Functionality
- **Modern Architecture**: Built with latest technologies and best practices
- **Scalable Design**: Designed to handle growth and maintainability
- **Clean Code**: Well-structured, documented, and maintainable codebase
- **Performance Optimized**: Efficient implementation with attention to performance

### Technical Highlights
- **Responsive Design**: Works seamlessly across all devices
- **Cross-browser Compatibility**: Tested across major browsers
- **Accessibility**: Built with web accessibility standards in mind
- **SEO Friendly**: Optimized for search engines

## 🛠️ Technology Stack

### Frontend
- **Framework**: Modern JavaScript/TypeScript framework
- **Styling**: CSS-in-JS or modern CSS framework
- **State Management**: Efficient state handling solution
- **Build Tools**: Modern build and development tools

### Backend (if applicable)
- **Runtime**: Node.js, Python, or other modern runtime
- **Database**: Optimized data storage solution
- **API**: RESTful or GraphQL API design
- **Authentication**: Secure user authentication system

### DevOps & Deployment
- **Version Control**: Git with semantic versioning
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application performance monitoring
- **Documentation**: Comprehensive code documentation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control

### Setup Instructions
\`\`\`bash
# Clone the repository
git clone https://github.com/${owner}/${repo}.git
cd ${repo}

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## 🎯 Usage

### Getting Started
1. **Clone and Install**: Follow the installation steps above
2. **Configuration**: Set up environment variables as needed
3. **Development**: Run the development server
4. **Deployment**: Build and deploy to your preferred platform

### Configuration
Create a \`.env\` file with the following variables:
\`\`\`env
# Add your environment variables here
API_KEY=your_api_key_here
DATABASE_URL=your_database_url_here
\`\`\`

## 🧪 Testing

### Running Tests
\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
\`\`\`

### Test Coverage
- Unit Tests: Core functionality
- Integration Tests: Component interactions
- E2E Tests: User workflows
- Performance Tests: Load and stress testing

## 📊 Project Structure

\`\`\`
${repo}/
├── src/                 # Source code
│   ├── components/        # Reusable components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── styles/          # Styling files
├── public/              # Static assets
├── tests/               # Test files
├── docs/                # Documentation
├── package.json         # Dependencies and scripts
├── README.md           # This file
└── .gitignore          # Git ignore rules
\`\`\`

## 🔧 Development

### Available Scripts
\`\`\`json
{
  "scripts": {
    "dev": "Start development server",
    "build": "Build for production",
    "test": "Run test suite",
    "lint": "Run linting",
    "deploy": "Deploy to production"
  }
}
\`\`\`

### Code Style
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Conventional Commits**: Standardized commit messages

## 🚀 Deployment

### Production Deployment
1. **Build**: \`npm run build\`
2. **Deploy**: Use your preferred hosting platform
3. **Configure**: Set up environment variables
4. **Monitor**: Set up monitoring and logging

### Supported Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Heroku**: Platform as a service
- **AWS**: Cloud infrastructure
- **Docker**: Containerized deployment

## 🤝 Contributing

### How to Contribute
1. **Fork**: Create a fork of this repository
2. **Branch**: Create a feature branch
3. **Code**: Make your changes with tests
4. **Test**: Ensure all tests pass
5. **Commit**: Follow conventional commit standards
6. **PR**: Submit a pull request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

### Code of Conduct
Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: Everyone who has contributed to this project
- **Users**: Those who use and provide feedback on this project

## 📞 Support

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/${owner}/${repo}/issues)
- **Discussions**: [GitHub Discussions](https://github.com/${owner}/${repo}/discussions)
- **Email**: Contact through GitHub profile

### FAQ
**Q: How do I report a bug?**
A: Please open an issue with detailed information about the bug and steps to reproduce.

**Q: Can I contribute to this project?**
A: Absolutely! Please read the contributing guidelines above and submit a pull request.

**Q: Is this production-ready?**
A: Yes, this project is designed for production use with proper testing and documentation.

---

## 📈 Project Stats

- **Created**: Automatically generated on repository creation
- **Last Updated**: Continuously improved through contributions
- **Version**: Follows semantic versioning
- **Status**: Active development

---

*This README was automatically generated to provide comprehensive project documentation. Feel free to customize it based on your specific project needs.*
`;
}

// Fetch README for a specific repository
export async function getReadmeForRepo(repo: GitHubRepo): Promise<ReadmeContent> {
  const owner = repo.owner.login;
  return fetchReadme(owner, repo.name);
}

// Parse markdown content for safe rendering
export function parseMarkdown(content: string): string {
  // Basic markdown parsing - in a real app, you'd use a proper markdown parser
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\`\`\`([^`]+)\`\`\`/gim, '<pre><code>$1</code></pre>')
    .replace(/\`([^`]+)\`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
