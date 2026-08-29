import { useContext, useState ,useEffect, use} from "react";
import Chat from "./Chat.jsx"
import "./ChatWindow.css"
import { MyContext } from "./Mycontext.jsx";
import {ScaleLoader} from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ChatWindow() {
    const{prompt,setPrompt,reply,setReply,currThreadID,setCurrThreadID,prevChats,setPrevChats,setNewChat,setUser,user,setIsAuthenticated}=useContext(MyContext);
    const[loading,setLoading]=useState(false);
    const[isOpen,setIsOpen]=useState(false);
    const navigate = useNavigate();

    const getReply=async ()=>{
        if(!user){
            alert("please login/signup  to chat with gpt");
            navigate("/signup");
            return;
        }
        setLoading(true);
        setNewChat(false);
        const options={
            method : "POST",
            headers:{
                "content-type":"application/json"
            },
            credentials: "include",
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadID
            })
        };
        try{
            // const response=await fetch("http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/chat",options);
            const response=await fetch("http://localhost:8080/api/chat",options);
            const res=await response.json();
            console.log(res);
            setReply(res.reply);
        }catch(err){
            consol.log(err)
        }
        setLoading(false);
    }

    //applied new chat to prevchats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                 [...prevChats,{
                role:"user",
                content:prompt
            },{
                role:"model",
                content:reply
            }]
            ))
           
        }
        setPrompt("");
    },[reply]);
    const showDropDown=()=>{
        setIsOpen(!isOpen);
    }
    const handleLogout=async()=>{
         try {
            if(!user){
                alert("you already logout please login");
                navigate("/login");
                return;
            }
            const result=confirm("Do you want to logout?")
            if(!result) return;
            const res = await axios.delete(
                // "http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/auth/logout",
                "http://localhost:8080/api/auth/logout",
                {
                    withCredentials: true
                }
            );

            console.log(res.data);

            setUser(null);
            setIsAuthenticated(false);
            alert(res.data.message);
            navigate("/login");

        } catch (error) {

            console.log(error);
            // alert(
            //    "Login first to logout"
            // );
            // navigate("/login");

        }
    

    }
    return ( 
        <div className="chatWindow">
            <div className="navbar">
                <span>GPT <i class="fa-solid fa-angle-down"></i></span>
                {
                    user? <p className="signUp">Hi, {user} </p>:<Link className="signUp"to="/signup">SignUp </Link>
                }
                {/* <Link className="signUp"to="/signup">SignUp </Link> */}
                <div className="userIconDiv" onClick={showDropDown}>
                <span className="userIcon"><i class="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plane</div>
                    <div className="dropDownItem" onClick={handleLogout}><i class="fa-solid fa-right-from-bracket"></i>LogOut</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="white" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e)=>{setPrompt(e.target.value)}}
                        onKeyDown={(e)=>e.key=="Enter"?getReply():''}
                    >
                        
                    </input>
                    <div id="submit" onClick={getReply}><i class="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">GPT can make mistakes. Check importanat info. see cookie Preference</p>
            </div>
        </div>
     );
}

export default ChatWindow;