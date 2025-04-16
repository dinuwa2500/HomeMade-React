import './index.css';
import {
  createBrowserRouter,
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/SideBar';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div className="sideBarWrapper w-[18%] ">
                <Sidebar />
              </div>
              <div className="contentRight w-[78%] py-4 px-5">
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
