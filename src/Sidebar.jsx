import './Sidebar.css'
import { useContext ,useEffect} from 'react';
import { MyContext } from './Mycontext.jsx';
import {v1 as uuidv1} from "uuid"
import blacklogo from "./assets/blacklogo.png";

function Sidebar() {
    const {allThreads,setAllThreads,currThreadID,newChat,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats,user} = useContext(MyContext);

    const getAllThreads=async()=>{
        try{
            // http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/thread
            const response=await fetch("http://localhost:8080/api/thread",{
                credentials: "include"
            });
            const res=await response.json();
            const filterData = res.map(thread => ({threadId: thread.threadId,title: thread.title}));
            // console.log(res);
            console.log(filterData);
            setAllThreads(filterData)
            //thread id ,title

        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        //fetch all threads from backend
        // console.log(user);
      getAllThreads();

    },[currThreadID])

    const createNewChat=()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);

    }
    const changeThread=async(newThreadId)=>{
        setCurrThreadId(newThreadId);
        try{
            // http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/thread/
            const response=await fetch(`http://localhost:8080/api/thread/${newThreadId}`,{
                credentials: "include"
            });
            const res=await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }
    const deleteThread=async(threadId)=>{
        try{
            // http://ec2-65-0-31-60.ap-south-1.compute.amazonaws.com:8080/api/thread/
            const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE",credentials: "include"});
            const res=await response.json();
            console.log(res);
            setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));
            if(threadId===currThreadID){
                createNewChat();
            }
             
        }catch(err){
                console.log(err);
        }
    }
    return ( 
       <section className='sidebar'>
        {/* new chat button */}
        <button onClick={createNewChat}>
            <img src={blacklogo} alt='gpt logo' className='logo'></img>
            <span><i class="fa-solid fa-pen-to-square"></i></span>
        </button>

        {/* chat history */}
        
        <ul className='history'>
            {   
                user ?(
                allThreads?.map((thread,idx)=>(
                    <li key={idx}
                    onClick={()=>changeThread(thread.threadId)}
                    className={thread.threadId===currThreadID ?"highlighted":""}
                    >{thread.title}
                    <i className="fa-solid fa-trash"
                    onClick={(e)=>{
                        e.stopPropagation();
                        deleteThread(thread.threadId);
                    }}
                    ></i>
                    </li>
                ))
            ): (
                <p>Please login to see chat history</p>
            )
            }
        </ul>

        {/* small sign */}
        <div className="sign">
            <p>Made by AFFAN &hearts;</p>    
        </div>
       </section>
     );
}

export default Sidebar;