$ = selector => document.querySelector(selector);

const res = $('#result');
$('#search-btn').addEventListener('click', (e)=>{
  e.preventDefault();
  res.innerHTML = `<div id="loader"><img src="dotted.gif" alt="loading..."/></div>`;

  const username = $('#search-box').value;
  const requri = `https://api.github.com/users/${username}`;
  const repouri = `https://api.github.com/users/${username}/repos`;
  let repos = '';

  fetch(repouri) // fetch user repository list
  .then((res)=> res.json())
  .then((repo)=> {
    if (repo.length == 0) {
      let repos = `<p>No repositories</p>`;
    } else{
      console.log(repo)
      repo.forEach(function(item){
        repos += `
        <li class="list-item">
          <h3 class="repo-title">${item.name}</h3>
          <p class="repo-desc">${item.description}</p>
          <p class="repo-link-para">Visit the repository: <a class="repo-link" href="${item.html_url}">${item.name}</a></p>
        </li>
        `;
      }) // end of loop
    } // end of if-else statement
    fetch(requri) // fetch user info
    .then((res)=> res.json())
    .then((data)=>{
      console.log(data);
      if(data.message == "Not Found" || username == ''){
        res.innerHTML = `<h2>No User Info Found</h2>`;
      } else {
        // else we have a user and we display their info
        let fullname;
        const username   = data.login;
        if(data.name == undefined || data.name == null){
          fullname = username;
        }
        else{
          fullname = data.name;
        }
        const aviurl     = data.avatar_url;
        const profileurl = data.html_url;
        const location   = data.location;
        const followersnum = data.followers;
        const followingnum = data.following;
        const reposnum     = data.public_repos;
        const bio = data.bio;
        const list = repos;
        const web = data.blog;

        // if(fullname == undefined || fullname == null) 

        let reposLink;
        
        if(reposnum > 30) {
          reposLink = `<p><a href="https://www.github.com/${username}?tab=repositories" target="_blank">See all repositories</a></p>`;
         } else {
          reposLink = '';
         };

        let output = `
          <div class="user">
            <p class="img-div">
              <img src="${aviurl}" alt="${username}" class="profile-img"/>
              <span class="bold">${fullname}</span><br />
            </p>
            <span><a href="${profileurl}" target="_blank">@${username}</a></span>
            <p>Bio: ${bio}</p>
            <p>followers: ${followersnum} ~ following: ${followingnum}</p>
            <p>Website / Blog : <a href="${web}" target="_blank">${web}</a></p>
            <p>Repositories: ${reposnum}</p>
            <div class="reposlist">
              <ol>
                ${list}
              </ol>
              ${reposLink}
            </div>
          </div>
          `;
        res.innerHTML = output;
      } // end of if-else statement
    }) // end of user info promise
    .catch((e)=> {console.log(e), res.innerHTML = `${e}.. Try again!`});
  }) // end of user repo promise
  .catch((e)=>{console.log(e), res.innerHTML = `${e}.. Try again!`});
}) // end of function promise
