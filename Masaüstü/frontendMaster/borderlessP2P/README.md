# BorderlessP2P

A decentralized peer-to-peer marketplace for cross-border product delivery, built with React, TypeScript, and Stellar blockchain integration.

## 🌟 Features

- **Cross-Border Shopping**: Request products from anywhere in the world
- **Travel-Based Delivery**: Travelers can earn money by bringing requested products
- **Blockchain Integration**: Secure transactions using Stellar blockchain
- **Escrow System**: Safe payment handling until delivery confirmation
- **Real-time Messaging**: Chat system for buyers and travelers
- **Reputation System**: NFT-based reputation tracking
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/borderlessP2P.git
cd borderlessP2P
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Build Tool**: Vite
- **Blockchain**: Stellar SDK
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React

## 📱 Pages & Features

### Landing Page
- Platform introduction with "How It Works" section
- Feature highlights and call-to-action buttons
- Responsive design for all screen sizes

### Main Application
- **Discover**: Browse popular products and create requests
- **Orders**: Track your orders and delivery status
- **Travels**: Manage your travel offerings
- **Messages**: Chat with buyers/travelers
- **Profile**: View reputation and transaction history

### Core Functionality
- **Wallet Integration**: Connect Stellar wallets
- **Product Requests**: Create detailed product requests
- **Travel Offers**: Add travel routes for delivery
- **Escrow Payments**: Secure blockchain-based payments
- **Reputation System**: Build trust through successful transactions

## 🌐 Blockchain Integration

The application integrates with the Stellar blockchain for:
- Secure wallet connections
- Escrow smart contracts
- Payment processing
- Reputation NFTs
- Transaction history

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Auth.tsx        # Wallet authentication
│   ├── Layout.tsx      # Main layout wrapper
│   └── BottomNav.tsx   # Mobile navigation
├── contexts/           # React context providers
│   ├── WalletContext.tsx
│   └── BlockchainContext.tsx
├── pages/              # Application pages
│   ├── Landing.tsx     # Landing page
│   ├── Home.tsx        # Main dashboard
│   ├── Orders.tsx      # Order management
│   ├── Products.tsx    # Travel management
│   ├── Chat.tsx        # Messaging system
│   └── Profile.tsx     # User profile
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## 🎨 Design System

The project uses a modern design system with:
- **Color Scheme**: Professional blue and gray palette
- **Typography**: Clean, readable fonts
- **Components**: Consistent UI components from shadcn/ui
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project follows:
- TypeScript strict mode
- ESLint configuration
- Consistent component structure
- Modern React patterns (hooks, functional components)

## 🚀 Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [Documentation](https://your-docs-url.com)
- [Stellar Documentation](https://developers.stellar.org/)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: your-email@example.com

---

Built with ❤️ using React and Stellar blockchain technology.
