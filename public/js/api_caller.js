function GetDataFromServer(url,itemName,Callback){
    console.log("called")
    fetch(url, {
            method: 'GET'
            }).then(response => {
                if(response.ok){
                    console.log(response.ok)
                response.json().then((result)=>{
                    if(result.code == 1){
                        Callback(result.data)
                        }else{alert(`Could Not Get ${itemName} from server`) }
                })                                                   
                }else{
                
                    alert(`Could Not Get ${itemName}.Network?`)                                                                                                                        
                }
            })
}