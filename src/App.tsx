import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { reserves } from './data/reserves'
import ReservePage from './components/ReservePage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/reserves/${reserves[0].id}`} replace />} />
        <Route path="/reserves/:reserveId" element={<ReservePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
