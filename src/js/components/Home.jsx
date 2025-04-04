import React,{useState} from "react";



//create your first component
const Home = () => {
	const [posts,setPosts] = useState([]);
    
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then((resp)=> resp.json())
    .then((data)=> setPosts(data))


    const options = {
            method: "POST",
            headers:{"Content-Type": "application/json"},

            body: JSON.stringify({
                title: 'foo',
                body: 'bar',
                userId: 1,
      }),
    };

    fetch("https://jsonplaceholder.typicode.com/posts", options)
    .then((resp)=> resp.json())
    .then((data)=> console.log("Post Status:",data))

    return(
        <div className="text-center">
            {posts.length > 0 ? 
            
            posts.map((item) => {
                return(
                    <div>{item.title}</div>
                )
        
            })
            
            : "no posts available"}
        </div>
    )
};

export default Home;