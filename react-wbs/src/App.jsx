import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import VMC from './pages/VMC';
import OrganizationalStructure from './pages/OrganizationalStructure';
import RecognizedOrganizations from './pages/RecognizedOrganizations';
import Memorandum from './pages/Resources/Memorandum';
import LearningMaterials from './pages/Resources/LearningMaterials';
import Location from './pages/Location';
import Research from './pages/Research';
import TransparencyInfo from './pages/Transparency/TransparencyInfo';
import { AuthProvider } from './lib/AuthContext';
import AdminLayout from './components/AdminLayout';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOrgStructure from './pages/Admin/OrganizationalStructure';
import AdminRecognizedOrgs from './pages/Admin/RecognizedOrganizations';
import AdminResearch from './pages/Admin/Research';
import AdminMemoranda from './pages/Admin/Memoranda';
import AdminLearningMaterials from './pages/Admin/LearningMaterials';
import AdminLocation from './pages/Admin/Location';

const pageTitles = {
  '/': 'Home',
  '/about/history': 'Historical Profile',
  '/about/vmc': 'Vision and Mission',
  '/about/organizational-structure': 'Organizational Structure',
  '/about/recognized-organizations': 'Recognized Organizations',
  '/resources/school-memorandum': 'School Memorandum',
  '/resources/division-memorandum': 'Division Memorandum',
  '/resources/deped-memorandum': 'DepEd Memorandum',
  '/resources/deped-order': 'DepEd Order',
  '/resources/grade-7': 'Grade 7 Learning Materials',
  '/resources/grade-8': 'Grade 8 Learning Materials',
  '/resources/grade-9': 'Grade 9 Learning Materials',
  '/resources/grade-10': 'Grade 10 Learning Materials',
  '/location': 'Location',
  '/research': 'Research',
  '/transparency/info': 'Transparency Information',
  '/transparency/app': 'Annual Procurement Plan',
  '/transparency/award-contracts': 'Award of Contracts',
  '/transparency/bac': 'Bids and Awards Committee',
  '/transparency/bid-bulletin': 'Bid Bulletin',
  '/transparency/invitation-to-bid': 'Invitation to Bid',
  '/transparency/philgeps': 'PhilGEPS',
  '/transparency/procurement-reports': 'Procurement Reports',
  '/transparency/spta': 'SPTA',
  '/transparency/sslg': 'SSLG',
  '/transparency/bsp': 'BSP',
  '/transparency/gsp': 'GSP',
  '/transparency/tr': 'TR',
  '/transparency/mooe': 'MOOE',
  '/transparency/red-cross': 'Red Cross',
  '/transparency/sef': 'SEF Records',
  '/transparency/year-end-report': 'Year End Report',
  '/admin/login': 'Admin Login',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/organizational-structure': 'Admin Organizational Structure',
  '/admin/recognized-organizations': 'Admin Recognized Organizations',
  '/admin/memoranda': 'Admin Memoranda',
  '/admin/learning-materials': 'Admin Learning Materials',
  '/admin/research': 'Admin Research',
  '/admin/location': 'Admin Location',
  '/admin/transparency': 'Admin Transparency',
};

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = pageTitles[pathname] || 'Page Under Construction';
    document.title = `${pageTitle} | RMNHS`;
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PageTitle />
        <Routes>
          {/* Admin Routes (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={<AdminLayout><AdminDashboard /></AdminLayout>} 
          />
          <Route 
            path="/admin/organizational-structure" 
            element={<AdminLayout><AdminOrgStructure /></AdminLayout>} 
          />
          <Route 
            path="/admin/recognized-organizations" 
            element={<AdminLayout><AdminRecognizedOrgs /></AdminLayout>} 
          />
          <Route 
            path="/admin/memoranda" 
            element={<AdminLayout><AdminMemoranda /></AdminLayout>} 
          />
          <Route 
            path="/admin/learning-materials" 
            element={<AdminLayout><AdminLearningMaterials /></AdminLayout>} 
          />
          <Route 
            path="/admin/research" 
            element={<AdminLayout><AdminResearch /></AdminLayout>} 
          />
          <Route 
            path="/admin/location" 
            element={<AdminLayout><AdminLocation /></AdminLayout>} 
          />
          <Route 
            path="/admin/transparency" 
            element={<AdminLayout><AdminMemoranda /></AdminLayout>} // Reusing Memoranda for transparency
          />
          
          {/* User Routes (With Layout) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about/history" element={<Layout><History /></Layout>} />
          <Route path="/about/vmc" element={<Layout><VMC /></Layout>} />
          <Route path="/about/organizational-structure" element={<Layout><OrganizationalStructure /></Layout>} />
          <Route path="/about/recognized-organizations" element={<Layout><RecognizedOrganizations /></Layout>} />
          
          <Route path="/resources/school-memorandum" element={<Layout><Memorandum tableName="school_memorandum" title="School Memorandum" /></Layout>} />
          <Route path="/resources/division-memorandum" element={<Layout><Memorandum tableName="division_memorandum" title="Division Memorandum" /></Layout>} />
          <Route path="/resources/deped-memorandum" element={<Layout><Memorandum tableName="deped_memorandum" title="DepEd Memorandum" /></Layout>} />
          <Route path="/resources/deped-order" element={<Layout><Memorandum tableName="deped_order" title="DepEd Order" /></Layout>} />

          <Route path="/resources/grade-7" element={<Layout><LearningMaterials grade="Grade 7" /></Layout>} />
          <Route path="/resources/grade-8" element={<Layout><LearningMaterials grade="Grade 8" /></Layout>} />
          <Route path="/resources/grade-9" element={<Layout><LearningMaterials grade="Grade 9" /></Layout>} />
          <Route path="/resources/grade-10" element={<Layout><LearningMaterials grade="Grade 10" /></Layout>} />
          
          <Route path="/location" element={<Layout><Location /></Layout>} />
          <Route path="/research" element={<Layout><Research /></Layout>} />

          <Route path="/transparency/info" element={<Layout><TransparencyInfo /></Layout>} />
          <Route path="/transparency/app" element={<Layout><Memorandum tableName="app" title="Annual Procurement Plan (APP)" /></Layout>} />
          <Route path="/transparency/award-contracts" element={<Layout><Memorandum tableName="award_of_contracts" title="Award of Contracts" /></Layout>} />
          <Route path="/transparency/bac" element={<Layout><Memorandum tableName="bac" title="Bids and Awards Committee" /></Layout>} />
          <Route path="/transparency/bid-bulletin" element={<Layout><Memorandum tableName="bid_bulletin" title="Bid Bulletin" /></Layout>} />
          <Route path="/transparency/invitation-to-bid" element={<Layout><Memorandum tableName="invitation_to_bid" title="Invitation to Bid" /></Layout>} />
          <Route path="/transparency/philgeps" element={<Layout><Memorandum tableName="philgeps" title="PhilGEPS" /></Layout>} />
          <Route path="/transparency/procurement-reports" element={<Layout><Memorandum tableName="procurement_reports" title="Procurement Reports" /></Layout>} />
          <Route path="/transparency/spta" element={<Layout><Memorandum tableName="spta" title="SPTA" /></Layout>} />
          <Route path="/transparency/sslg" element={<Layout><Memorandum tableName="sslg" title="SSLG" /></Layout>} />
          <Route path="/transparency/bsp" element={<Layout><Memorandum tableName="bsp" title="BSP" /></Layout>} />
          <Route path="/transparency/gsp" element={<Layout><Memorandum tableName="gsp" title="GSP" /></Layout>} />
          <Route path="/transparency/tr" element={<Layout><Memorandum tableName="tr" title="TR" /></Layout>} />
          <Route path="/transparency/mooe" element={<Layout><Memorandum tableName="mooe" title="MOOE" /></Layout>} />
          <Route path="/transparency/red-cross" element={<Layout><Memorandum tableName="red_cross" title="Red Cross" /></Layout>} />
          <Route path="/transparency/sef" element={<Layout><Memorandum tableName="sef" title="SEF Records" /></Layout>} />
          <Route path="/transparency/year-end-report" element={<Layout><Memorandum tableName="year_end_report" title="Year End Report" /></Layout>} />
          
          <Route path="*" element={<Layout><div className="p-20 text-center">Page under construction</div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
