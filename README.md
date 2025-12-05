# 📚 Kapalin Gita Tales

> **Ancient Wisdom for Young Minds**

A premium e-commerce platform for children's books inspired by the Bhagavad Gita, Chanakya Niti, and other timeless Indian wisdom tales. Beautiful stories that nurture young minds with ancient wisdom.

## 🌟 Features

### Customer Features
- **Product Catalog**: Browse premium children's books with beautiful imagery
- **Shopping Cart**: Add products to cart with quantity management
- **Secure Checkout**: Complete checkout form with address and contact details
- **Order Confirmation**: Receive order confirmation with all delivery details
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **User Authentication**: Secure login and registration system
- **Order History**: Track past orders and delivery status
- **Wishlist**: Save favorite books for later

### Admin Features
- **Product Management**: Add, edit, and remove products
- **Order Management**: View and manage customer orders
- **Inventory Tracking**: Monitor stock levels
- **Analytics Dashboard**: Track sales and customer insights

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Supabase (Authentication, Database, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes (Dark/Light mode)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd hello-cloud-palace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
hello-cloud-palace/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🎨 Design Philosophy

- **Premium Aesthetics**: Modern, vibrant design with smooth animations
- **User-Centric**: Intuitive navigation and seamless user experience
- **Accessibility**: WCAG compliant with proper semantic HTML
- **Performance**: Optimized for fast loading and smooth interactions
- **Mobile-First**: Responsive design that works on all devices

## 🔐 Authentication

The platform uses Supabase Authentication with support for:
- Email/Password authentication
- Social login (Google, Facebook)
- Password reset functionality
- Email verification

## 📦 Key Features Implementation

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart state
- Real-time price calculations

### Checkout Process
1. Review cart items
2. Enter delivery details (name, mobile, address, PIN code)
3. Confirm order
4. Receive order confirmation with order number

### Order Management
- Order tracking
- Order history
- Delivery status updates
- Invoice generation

## 🌐 Deployment

### Deploy to Lovable
Simply open [Lovable](https://lovable.dev/projects/582c6164-f12d-4e3c-bed1-2d0989693100) and click on **Share → Publish**.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

## 🔧 Configuration

### Custom Domain
To connect a custom domain:
1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow the DNS configuration steps

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please contact the development team.

## 🙏 Acknowledgments

- Inspired by the timeless wisdom of Bhagavad Gita and Chanakya Niti
- Built with love for nurturing young minds with ancient Indian wisdom
- Special thanks to all contributors and supporters

---

**Made with ❤️ for Kapalin Gita Tales**
