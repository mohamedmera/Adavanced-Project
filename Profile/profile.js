
document.getElementById('checkboxforpasswordforLogin').addEventListener('change',() => {
    var passwardInput = document.getElementById('password-inputforLogin');
    if(document.getElementById('checkboxforpasswordforLogin').checked){
        passwardInput.type = 'text';
    }else {
        passwardInput.type = 'password';
    }
})

document.getElementById('checkboxforpasswordReg').addEventListener('change',() => {
    var passwardInput = document.getElementById('password-inputforReg');
    if(document.getElementById('checkboxforpasswordReg').checked){
        passwardInput.type = 'text';
    }else {
        passwardInput.type = 'password';
    }
})

const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('postId')

const baseUrl = 'https://tarmeezacademy.com/api/v1';

function getCurrentUser(){
    let user = null;
    const storgeUser = localStorage.getItem('username')

    if(storgeUser != null){
        user = JSON.parse(storgeUser)
    }
    return user
}


function loginBtnClecked(){
const username = document.getElementById('username-inputforLogin').value
const password = document.getElementById('password-inputforLogin').value

    const prams = {
        username: username,
        password: password
    }

    toggleLoader(true)

    axios.post(baseUrl + '/login',prams)
    .then(response => {

        const modal = document.getElementById('modalLogin')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()


        localStorage.setItem('token',response.data.token);
        localStorage.setItem('username',JSON.stringify(response.data.user));
        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforLogin').value = '';
        document.getElementById('password-inputforLogin').value = '';
        setupUI()

    }).catch(error => {

        document.getElementById('fakePassword').style.display = 'flex'
        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('username-inputforLogin').value = '';
        document.getElementById('password-inputforLogin').value = '';

    }).finally(() => toggleLoader(false))

}
setupUI()
function regBtnClecked(){
    const username = document.getElementById('username-inputforReg').value
    const password = document.getElementById('password-inputforReg').value
    const image = document.getElementById('image-inputforReg').files[0]
    const name = document.getElementById('name-inputforReg').value

    let formData = new FormData()
    formData.append('image',image)
    formData.append('username',username)
    formData.append('password',password) 
    formData.append('name',name) 

    toggleLoader(true)

    axios.post(baseUrl + '/register',formData ,{
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        localStorage.setItem('token',response.data.token);
        localStorage.setItem('username',JSON.stringify(response.data.user));

        const modal = document.getElementById('modalReg')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforReg').value = '';
        document.getElementById('password-inputforReg').value = '';
        document.getElementById('name-inputforReg').value = '';
        loginBtnClecked()

        
    }).catch(error => {

        document.getElementById('usernameTaken').style.display = 'flex'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforReg').value = '';
        document.getElementById('password-inputforReg').value = '';
        document.getElementById('name-inputforReg').value = '';


    }).finally(() => toggleLoader(false))

}


function logOUt(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    document.getElementById('logoutdiv').style.display = 'none'
    document.getElementById('btnLoginNav').style.display = 'flex'
    document.getElementById('btnRegNav').style.display = 'flex'

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
getUserProfile()

function getUserProfile(){

    toggleLoader(true)
    

    axios.get(baseUrl + '/users/' + id)
    .then(response => {

        let user = response.data.data;



        document.getElementById('header-image').src = user.profile_image;
        
        document.getElementById('name').innerHTML = user.name;
        document.getElementById('email').innerHTML = user.email;
        document.getElementById('username').innerHTML = user.username;

        document.getElementById('name-author').innerHTML = user.name + ' Posts';

        document.getElementById('Num-Posts').innerHTML = user.posts_count;
        document.getElementById('Num-comments').innerHTML = user.comments_count;
        getPost()

    })

    .finally(() => toggleLoader(false))
    

}


function getPost(){

    toggleLoader(true)


    axios.get(baseUrl + '/users/' + id +'/posts')

    .then(response => {

    

        let posts = response.data.data

        document.getElementById('colectionCards').innerHTML = '';

        
        for(post of posts){

            let postTitle = ""

            let user = getCurrentUser()
            let isMypost = user !=  null && post.author.id == user.id

            let btnconEdit = ``
            let btnconDelete = ``

            if(isMypost){
                btnconEdit = `<button class="btn btn-secondary" onclick="EditPostBtnClecked('${encodeURIComponent(JSON.stringify(post))}')" style="float: right;" id="editbtn"> edit</button>`
                btnconDelete = `<button class="btn btn-danger" onclick="DeletePostBtnClecked('${encodeURIComponent(JSON.stringify(post))}')" style="float: right; margin-left: 10px;" id="deletebtn"> Delete</button>`
            }

            if(post.title != null){
                postTitle = post.title
            }
            const author = post.author;
            let content = `
                <div class="card rounded shadoe">
                    <div class="card-header">
                        <img src="${author.profile_image}" alt="404" class="rounded-circle" style="width: 50px; height: 50px;">  
                        <b class="ml-2">${author.username}</b>
                        
                        ${btnconDelete}
                        
                        ${btnconEdit}


                        <h5 style="color: rgb(111, 111, 111);" class="mt-2">${post.created_at}</h5>
                    </div>
                    <div class="card-body">
                        <img src="${post.image}" alt="404" class="w-100">
                        <h5 class="card-title">${postTitle}</h5>
                        <p class="card-text">
                            ${post.body}
                        </p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                        <hr>
                        <div onclick="postClicked(${post.id})" class="inclick">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                            <span>
                                (${post.comments_count})comment
                                <span id="postTags">
                                    
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `
            document.getElementById('colectionCards').innerHTML += content;

            document.getElementById("postTags").innerHTML = '';
            for(tag of  post.tags){
                console.log(tag.name);
                let con = `
                    <button>${tag.name}</button>
                `
            document.getElementById("postTags").innerHTML += con;

            } 

        }
    })

    .finally(() => toggleLoader(false))
}

function postClicked(postId) {
    location = `../PostDitailes/postDitailes.html?postId=${postId}`
}

function DeletePostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))

    
    document.getElementById('input-delete').value = post.id

    let postModal = new bootstrap.Modal(document.getElementById('modalDelPost'))
    postModal.show()
}
function confirmDelbtnClk(){
    
    const postId = document.getElementById('input-delete').value

    toggleLoader(true)

    axios.delete(baseUrl + `/posts/${postId}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {

        getPost()


    }).finally(() => toggleLoader(false))

}


function AddPostBtnClecked(){


    let postId = document.getElementById('postId-input').value
    let isCreate = postId == null || postId == ''

    
    let text =  document.getElementById('text-inputAddPost').value
    let body =  document.getElementById('textarea-inputAddPost').value
    let image = document.getElementById('image-inputAddPost').files[0]
    
    let formData = new FormData()
    formData.append('image',image)
    formData.append('title',text)
    formData.append('body',body) 
    

    if(isCreate == false){

        formData.append('_method', 'put')

        let url = baseUrl + `/posts/${postId}`

        toggleLoader(true)

        axios.post(url,formData, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {

            getPost()
            document.getElementById('text-inputAddPost').value = '';
            document.getElementById('textarea-inputAddPost').value = '';

        
        }).finally(() => toggleLoader(false))
    }
}   




function EditPostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))



    document.getElementById('text-inputAddPost').value = post.title
    document.getElementById('textarea-inputAddPost').value = post.body
    document.getElementById('postId-input').value = post.id
    document.getElementById('image-inputAddPost').files[0] = post.image
    
    
    document.getElementById('ModalLabelforAddPost').innerHTML = 'Edit Post: '
    document.getElementById('btnAdd').innerHTML = 'update'
    let postModal = new bootstrap.Modal(document.getElementById('modalAddPost'))
    postModal.show()
}

function toggleLoader(show = true){
    if(show){
        document.getElementById('loader').style.display = 'flex'
    }else{

        document.getElementById('loader').style.display = 'none'
    }
}