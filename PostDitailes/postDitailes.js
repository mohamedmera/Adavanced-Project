const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('postId')


const baseUrl = 'https://tarmeezacademy.com/api/v1';



function mainf(){

    toggleLoader(true)


    axios.get(baseUrl + '/posts/' + id)
    .then(response => {

        const post = response.data.data
        const comments = post.comments
        const author = post.author


        let commentContent = ``

        for(comment of comments){




            commentContent += `
            <div id="comment" class="mt-2">
                <img src=${comment.author.profile_image} alt="photo.png" class="rounded-circle" style="width: 40px;height: 40px;">
                
                <b class="b-comment">${comment.author.username}</b>
            </div>
            <div>
                <p class="p-comment">${comment.body}</p>
            </div>
                `
        }

        const content = `
            <div class="card rounded shadoe">
                <div class="card-header">
                    <img src="${author.profile_image}" onclick="getProfile(${author.id})" alt="404" class="rounded-circle" style="width: 50px; height: 50px;">  
                    <b class="ml-2">${author.username}</b>

                    
                    <h5 style="color: rgb(111, 111, 111);" class="mt-2">${post.created_at}</h5>
                </div>
                <div class="card-body">
                    <img src="${post.image}" alt="404" class="w-100">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">
                        ${post.body}
                    </p>      
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>
                            (${post.comments_count})Commrnts
                            <span id="postTags">
                                <button>Policy</button>
                            </span>
                        </span>
                    </div>
                </div>
                <div style="background-color: rgb(187, 187, 187);" class="p-3">
                    ${commentContent}
                </div>
                <div style="background-color: rgb(187, 187, 187);"  id="addcomment-form">
                    <div class="input-group mb-2">
                        <input type="text" id="input-addComment" class="form-control"  placeholder="...add Comment" aria-label="Recipient's username" aria-describedby="button-addon2">
                        <button class="btn btn-success" type="button" onclick="addComment()" id="button-addon2">send</button>
                    </div>
                </div>
        </div>
        `

        document.getElementById('username-span').innerHTML = author.username;
        
        document.getElementById('colectionCards').innerHTML = content;
    })
    .finally(() => {
        toggleLoader(false)
    })
}
setupUI()
mainf()
function addComment(){

    const add = document.getElementById('input-addComment').value

    let formData = {
        'body': add
    }

    toggleLoader(true)

    axios.post(`${baseUrl}/posts/${id}/comments`,formData ,{
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(() => {

        mainf()

    }).catch(error => {

        getAlert(error.response.data.massage, 'danger')

    }).finally(() => toggleLoader(false))

}

function getProfile(postId){
    location = `../Profile/profile.html?postId=${postId}`
}

function profileClk(){

    const user = getCurrentUser()
    
    const userId = user.id

    location = `../Profile/profile.html?postId=${userId}`

}



function logOUt(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    document.getElementById('logoutdiv').style.display = 'none'
    document.getElementById('btnLoginNav').style.display = 'flex'
    document.getElementById('btnRegNav').style.display = 'flex'
    getAlert("Logout successful", 'success')
}
function setupUI(){
    const user = getCurrentUser()
    
    const token = localStorage.getItem('token')
    if(token == null){

        document.getElementById('logoutdiv').style.display = 'none'
        document.getElementById('btnLoginNav').style.display = 'flex'
        document.getElementById('btnRegNav').style.display = 'flex'
    }else{

        document.getElementById('logoutdiv').style.display = 'flex'
        document.getElementById('btnLoginNav').style.display = 'none'
        document.getElementById('btnRegNav').style.display = 'none'

        document.getElementById('b').innerHTML = user.username;
        document.getElementById('imgHeader').src = user.profile_image;

    }

}

function getCurrentUser(){
    let user = null;
    const storgeUser = localStorage.getItem('username')

    if(storgeUser != null){
        user = JSON.parse(storgeUser)
    }
    return user
}

function toggleLoader(show = true){
    if(show){
        document.getElementById('loader').style.display = 'flex'
    }else{

        document.getElementById('loader').style.display = 'none'
    }
}
setupUI()
function getAlert(constMassage,type){
    const alertPlaceholder = document.getElementById('alertSuccess')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div style="display: inline;">${message}</div>`,
        `   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    appendAlert(constMassage,type)
    // setTimeout(() => {
    //     const alert = bootstrap.Alert.getOrCreateInstance('#alertSuccess')
    //     // alert.hide()
    // },2000)
}
