import './App.css'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import { MyContext } from './Mycontext'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import {v1 as uuid} from "uuid"
import Login from './Login'
import Signup from './SignUp'
import { isCookie } from 'react-router-dom'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


function App() {
  const[prompt,setPrompt] =useState("");
  const[reply,setReply]=useState(null);
  const[currThreadID,setCurrThreadId]=useState(uuid);
  const[prevChats,setPrevChats]=useState([]);
  const[newChat,setNewChat]=useState(true);
  const[allThreads,setAllThreads]=useState([]);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
// 
    const loadUser = async () => {

      try {

        const res = await axios.get(
          // "http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/auth/profile",
          "http://localhost:8080/api/auth/profile",

          {
            withCredentials: true
          }
        );
        console.log(res.data.name);
        setUser(res.data.name);
        setIsAuthenticated(true);

      } catch {

        setUser(null);
        setIsAuthenticated(false);

      }
    };

    loadUser();

  }, []);
    const providerValues={
      prompt,setPrompt,
      reply,setReply,
      currThreadID,setCurrThreadId,
      prevChats,setPrevChats,
      newChat,setNewChat,
      allThreads,setAllThreads,

      user, setUser,
      isAuthenticated, setIsAuthenticated,
    };

  return (
  
     <MyContext.Provider value={providerValues}>

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/"
            element={
              <div className='app'>
                <Sidebar />
                <ChatWindow />
              </div>
            }
          />

        </Routes>

      </BrowserRouter>

    </MyContext.Provider>
    
  );
}

export default App
