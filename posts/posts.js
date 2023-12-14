/* Posts Page JavaScript */
"use strict";
async function displayAllUserPosts() {
    const baseURL = "https://microbloglite.onrender.com/api/posts";

    
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJpYXQiOjE3MDI1MTEwOTQsImV4cCI6MTcwMjU5NzQ5NH0.Zq8iXS6gDfUqnXXRKTWRuyeHYcF1OMxINtljfcFtF8Y"; 

    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        redirect: 'follow'
    };

    try {
        const response = await fetch(baseURL, requestOptions);
        const data = await response.json();

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ""; // refresh card 

        data.forEach(post => {
            let userName = post.username;
            let postText = post.text;

            let cardHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="..." class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${userName}</h5>
                        <p class="card-text">${postText}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            `;

            postsContainer.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

