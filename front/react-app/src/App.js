import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Registration from './Components/Register';
import Login from './Components/Login';
import TopNav  from './Components/TopNav';
import Home  from './Components/Home';
import SendEmail from './Components/SendEmail';
import ChangePassword from './Components/ChangePassword';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Search }from './Components/Search';


const client = new ApolloClient({
  uri:'http://localhost:8000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

function App(){
  return(
    <ApolloProvider client={client}>
      <Router>
        <TopNav/>
          <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/home' element={<Home/>} />
          <Route path='/sendEmail' element={<SendEmail/>}/>
          <Route path='/changePassword' element={<ChangePassword/>}/>
          <Route path='/Search' element={<Search/>}/>
        </Routes>
      </Router>
    </ApolloProvider>
      
  )
}
export default App;
