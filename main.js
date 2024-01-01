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

const baseUrl = 'https://tarmeezacademy.com/api/v1';


let currentPage = 1
let lastPage = 1;
getPost()

// window.addEventListener("scroll", () => {
//     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
//     if (endOfPage  && currentPage < lastPage) {
//         currentPage = currentPage + 1
//         getPost(false,currentPage)
//     }
//   }
//   );

function getPost(reload = true,page = 1){


    axios.get(baseUrl + '/posts?&page=' + page)
    .then(response => {
         lastPage = response.data.meta.last_page
        if(reload){
            document.getElementById('colectionCards').innerHTML = ""
        }

        let posts = response.data.data

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
                        <img onclick="getProfile(${author.id})" src="${author.profile_image}" alt="404" class="rounded-circle" style="width: 50px; height: 50px;">  
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
                                    <button>Policy</button>
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
            } 

        }
    }).catch(error => console.log(error))
}
function loginBtnClecked(){
    const username = document.getElementById('username-inputforLogin').value
    const password = document.getElementById('password-inputforLogin').value

    const prams = {
        username: username,
        password: password
    }

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
        getAlert("Login successful", 'success')
    }).catch(error => {
        console.log(error)
        document.getElementById('fakePassword').style.display = 'flex'
        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('username-inputforLogin').value = '';
        document.getElementById('password-inputforLogin').value = '';
        getAlert(error.response.data.message, 'danger')
    })

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
        console.log(response)

        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforReg').value = '';
        document.getElementById('password-inputforReg').value = '';
        document.getElementById('name-inputforReg').value = '';
        loginBtnClecked()
        getAlert("Register successful", 'success')
        
    }).catch(error => {
        console.log(error)
        document.getElementById('usernameTaken').style.display = 'flex'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforReg').value = '';
        document.getElementById('password-inputforReg').value = '';
        document.getElementById('name-inputforReg').value = '';
        getAlert(error.response.data.massage, 'danger')


    })

}

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

function logOUt(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    document.getElementById('btnaddPost').style.display = 'none'
    document.getElementById('logoutdiv').style.display = 'none'
    document.getElementById('btnLoginNav').style.display = 'flex'
    document.getElementById('btnRegNav').style.display = 'flex'
    getAlert("Logout successful", 'danger')
}
function setupUI(){
    const user = getCurrentUser()
    
    const token = localStorage.getItem('token')
    if(token == null){
        document.getElementById('btnaddPost').style.display = 'none'
        document.getElementById('logoutdiv').style.display = 'none'
        document.getElementById('btnLoginNav').style.display = 'flex'
        document.getElementById('btnRegNav').style.display = 'flex'
    }else{
        document.getElementById('btnaddPost').style.display = 'flex'
        document.getElementById('logoutdiv').style.display = 'flex'
        document.getElementById('btnLoginNav').style.display = 'none'
        document.getElementById('btnRegNav').style.display = 'none'

        document.getElementById('b').innerHTML = user.username;
        document.getElementById('imgHeader').src = user.profile_image;

    }

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
    

    if(isCreate){

        axios.post(baseUrl + '/posts',formData, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            getPost()
            document.getElementById('text-inputAddPost').value = '';
            document.getElementById('textarea-inputAddPost').value = '';
            getAlert("Create Post successful", 'success')

        
        }).catch(error => {
            console.log(error)
            getAlert(error.response.data.massage, 'danger')

        })

    }else{
        formData.append('_method', 'put')

        let url = baseUrl + `/posts/${postId}`

        axios.post(url,formData, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            getPost()
            document.getElementById('text-inputAddPost').value = '';
            document.getElementById('textarea-inputAddPost').value = '';
            getAlert("Edit Post successful", 'success')
        
        }).catch(error => {
            console.log(error)
            getAlert(error.response.data.massage, 'danger')
        })

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


function postClicked(postId) {
    location = `postDitailes.html?postId=${postId}`
}


function EditPostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))

    console.log(post);

    document.getElementById('text-inputAddPost').value = post.title
    document.getElementById('textarea-inputAddPost').value = post.body
    document.getElementById('postId-input').value = post.id
    document.getElementById('image-inputAddPost').files[0] = post.image
    
    
    document.getElementById('ModalLabelforAddPost').innerHTML = 'Edit Post: '
    document.getElementById('btnAdd').innerHTML = 'update'
    let postModal = new bootstrap.Modal(document.getElementById('modalAddPost'))
    postModal.show()
}

function addbtnClecked(){

    document.getElementById('text-inputAddPost').value = ''
    document.getElementById('textarea-inputAddPost').value = ''
    document.getElementById('postId-input').value = ''
    document.getElementById('image-inputAddPost').files[0] = ''
    
    
    document.getElementById('ModalLabelforAddPost').innerHTML = 'Add Post: '
    document.getElementById('btnAdd').innerHTML = 'Create'
    
    let postModal = new bootstrap.Modal(document.getElementById('modalAddPost'))
    postModal.show()
}

function DeletePostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))

    console.log(post);
    
    document.getElementById('input-delete').value = post.id

    let postModal = new bootstrap.Modal(document.getElementById('modalDelPost'))
    postModal.show()
}
function confirmDelbtnClk(){
    
    const postId = document.getElementById('input-delete').value

    axios.delete(baseUrl + `/posts/${postId}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        console.log(response);
        getPost()
        getAlert('the Post has Deleted', 'success')

    }).catch(error => {
        console.log(error);
        getAlert(error.response.data.massage, 'danger')

    })

}
function getProfile(postId){
    location = `profile.html?postId=${postId}`
}
function profileClk(){

    const user = getCurrentUser()
    
    const userId = user.id

    location = `profile.html?postId=${userId}`

}