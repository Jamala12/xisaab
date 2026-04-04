import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import CustomersPage from './pages/CustomersPage'
import InvoicesPage from './pages/InvoicesPage'
import PaymentsPage from './pages/PaymentsPage'
import DetailedCustomerPage from './pages/DetailedCustomerPage'
import NewCustomerPage from './pages/NewCustomerPage'
import DetailedInvoicePage from './pages/DetailedInvoicePage'
import NewInvoicePage from './pages/NewInvoicePage'
import RecordPaymentPage from './pages/RecordPaymentPage'


function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Navbar/>
                    <DashboardPage/>
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/customers" element={
                <ProtectedRoute>
                    <Navbar/>
                    <CustomersPage/>
                </ProtectedRoute>
            } />
            <Route path="/invoices" element={
                <ProtectedRoute>
                    <Navbar/>
                    <InvoicesPage/>
                </ProtectedRoute>
            } />
            <Route path="/payments" element={
                  <ProtectedRoute>
                      <Navbar/>
                      <PaymentsPage/>
                  </ProtectedRoute>
            } />
            <Route path="/customers/new" element={
                <ProtectedRoute>
                    <Navbar/>
                    <NewCustomerPage/>
                </ProtectedRoute>
            } />
            <Route path="/customers/:id" element={
                <ProtectedRoute>
                    <Navbar/>
                    <DetailedCustomerPage/>
                </ProtectedRoute>
            } />
            <Route path="/invoices/new" element={
                <ProtectedRoute>
                    <Navbar/>
                    <NewInvoicePage/>
                </ProtectedRoute>
            } />
            <Route path="/invoices/:id/payment" element={
                <ProtectedRoute>
                    <Navbar />
                    <RecordPaymentPage />
                </ProtectedRoute>
            } />
            <Route path="/invoices/:id" element={
                <ProtectedRoute>
                    <Navbar/>
                    <DetailedInvoicePage/>
                </ProtectedRoute>
            } />
        </Routes>
    )
}

export default App