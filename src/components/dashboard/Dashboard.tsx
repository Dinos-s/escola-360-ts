import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';
import './Dashboard.css'

function Dasboard() {
    return (
        <>
            <div className="dashboard-layout">
                <Sidebar/>
                <main className="main-content">
                    <Outlet/>
                </main>
            </div>
        </>
    )
}

export default Dasboard;