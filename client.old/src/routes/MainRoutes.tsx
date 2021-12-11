import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Settings from '../views/Settings';
import Startpage from '../views/startpage/Startpage';


export default function MainRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Startpage />} />
            <Route path='/settings' element={<Settings />} />
        </Routes>
    )
}
