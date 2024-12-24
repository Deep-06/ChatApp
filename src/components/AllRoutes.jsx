import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { AddContact } from './AddContact'

export const AllRoutes = () => {
  return (
    <div>
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-contact" element={<AddContact />} />
      </Routes>
    </div>
  )
}
