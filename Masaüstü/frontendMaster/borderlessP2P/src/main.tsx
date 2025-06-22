import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { WalletProvider } from './contexts/WalletContext'
import { BlockchainProvider } from './contexts/BlockchainContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Requests from './pages/Requests'
import Orders from './pages/Orders'
import Create from './pages/Create'
import CreateProduct from './pages/CreateProduct'
import CreateRequest from './pages/CreateRequest'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import ChatDetail from './pages/ChatDetail'
import Proposals from './pages/Proposals'
import CreateProposal from './pages/CreateProposal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <BlockchainProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/create" element={<Create />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/create-request" element={<CreateRequest />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<ChatDetail />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/create-proposal" element={<CreateProposal />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BlockchainProvider>
    </WalletProvider>
  </StrictMode>,
)
