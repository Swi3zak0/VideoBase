import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Components/Register";
import Login from "./Components/Login";
import TopNav from "./Components/TopNav";
import Home from "./Components/Home";
import ChangePassword from "./Components/ChangePassword";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Search } from "./Components/Search";
import UploadVideo from "./Components/UploadVideo";
import Activated from "./Components/Activated";
import NewPassword from "./Components/NewPassword";
import ResetPassword from "./Components/ResetPassword";
import AddVideo from "./Components/AddVideo";
import CheckToken from "./Components/CheckToken";
import Footer from "./Components/Footer";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-height">
        <CheckToken />
        <Router>
          <TopNav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route
              path="/newPassword/:uid/:reset_code"
              element={<NewPassword />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/uploadVideo" element={<UploadVideo />} />
            <Route path="/activated" element={<Activated />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/addVideo" element={<AddVideo />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </ApolloProvider>
  );
}
export default App;
