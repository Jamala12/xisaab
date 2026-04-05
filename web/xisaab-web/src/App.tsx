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
import NotFoundPage from './pages/NotFoundPage'


function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <DashboardPage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/customers" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <CustomersPage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/invoices" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <InvoicesPage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/payments" element={
                  <ProtectedRoute>
                      <Navbar/>
                      <main className="ml-56 p-8 min-h-screen bg-background">
                        <PaymentsPage/>
                      </main>
                  </ProtectedRoute>
            } />
            <Route path="/customers/new" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <NewCustomerPage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/customers/:id" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <DetailedCustomerPage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/invoices/new" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <NewInvoicePage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/invoices/:id/payment" element={
                <ProtectedRoute>
                    <Navbar />
                    <main className="ml-56 p-8 min-h-screen bg-background">
                      <RecordPaymentPage />
                    </main>
                </ProtectedRoute>
            } />
            <Route path="/invoices/:id" element={
                <ProtectedRoute>
                    <Navbar/>
                    <main className="ml-56 p-8 min-h-screen bg-background">  
                      <DetailedInvoicePage/>
                    </main>
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default App