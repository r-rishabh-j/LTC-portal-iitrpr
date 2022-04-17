import React, {useState, useEffect} from 'react'
import {TodoPage} from './Pages/TodoPage'
import {
  HashRouter as Router,
  Routes,
  Route, 
  Link
} from "react-router-dom";
import {Show} from './Pages/Show'

function App() {
   return (
     <div className="App">
       <Router>
         <Routes>
           <Route path="/" element={<TodoPage />}></Route>
           
           <Route path="/:id" element={<Show />}></Route>
         </Routes>
       </Router>
     </div>
   );
}

export default App;