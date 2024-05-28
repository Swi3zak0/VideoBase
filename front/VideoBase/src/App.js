import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Components/Register";
import Login from "./Components/Login";
import TopNav from "./Components/TopNav";
import Home from "./Components/Home";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import UploadVideo from "./Components/UploadVideo";
import NewPassword from "./Components/NewPassword";
import ResetPassword from "./Components/ResetPassword";
import AddVideo from "./Components/AddVideo";
import CheckToken from "./Components/CheckToken";
import Footer from "./Components/Footer";
import VideoPost from "./Components/VideoPost";
import SearchScreen from "./Components/SearchScreen";
import MyProfile from "./Components/MyProfile";
import Settings from "./Components/Settings";
import Terms from "./Components/Terms";

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
            <Route path="/" element={<Home />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route
              path="/newPassword/:uid/:reset_code"
              element={<NewPassword />}
            />
            <Route path="/search/:keywords" element={<SearchScreen />} />
            <Route path="/uploadVideo" element={<UploadVideo />} />
            <Route path="/addVideo" element={<AddVideo />} />
            <Route path="/video/:id" element={<VideoPost />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </ApolloProvider>
  );
}
export default App;
