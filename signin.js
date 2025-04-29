document.getElementById("but").addEventListener("submit",function(e){
    e.preventDefault(); // دا بيمنع ان الداتا تتبعت في العادي من html غير لما نعالجها او الفالديشن يتحقق من الجافا اسكربت 
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // هنجيب الداتا اللي متخزنه ف الاستورتج 
    const storage = localStorage.getItem("");// id input email in sign up الايميل الموجود في البيدج اللي محمود بيعملها 
   ///الكوندشن هيبقا ان الايميل لو بيساوي الداتا اللي اتخزنت في الاستورج هيفتح الامتحان 
    if(email===storage.email  && password === storage.password){
        window.location.href="" // link page exam 

    }
    else{
        document.getElementById("error").textContent="email not find ";
    }
});