
 const Auth =async()=>{
    
        const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA"
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error("Failed to sign up");
          }
          const data = await response.json();
          console.log(data);
        }
        catch (er) {
          alert(er);
        }
      
      




    return(
        <>
        </>
    )
}
export default Auth;