document.addEventListener('click',function(e){
    if(e.target.classList.contains('edit-me')){
        let res =prompt("enter the name" , e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        console.log(res);

        axios.post('/update-item' , {name : res, id:e.target.getAttribute("data-id")}).then(function(){
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = res
        }).catch(function() {
            console.log("post error")
        })
    }

    if(e.target.classList.contains("delete-me")){
        confirm("Do you really want to delete this?")
        
        axios.post('/delete-item',{ id:e.target.getAttribute("data-id")}).then(function(){
             e.target.parentElement.parentElement.remove()
        }).catch(function(){
             console.log("error, try again")
        })
     }
})