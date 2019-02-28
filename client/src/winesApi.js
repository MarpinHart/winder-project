import axios from 'axios'
import api from './api'
//federicokey 83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c
//juliakey 58a43d5ad7mshf95a9a31e4661dbp1c44fajsn267461ee1adc
const service = axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine',
  withCredentials: false
})



const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error("API response", err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
  
  service: service,
  
  //get the three wines based on the food provided
  getWinesGeneral(food){
    return service.get(`/pairing?maxPrice=1000000000&food=${food}`,{
      headers: { "X-RapidAPI-Key":  '83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c' }
  }).then(res=>res.data)
    .catch(errHandler)
  },

  getWineReccomendation(wine,maxPrice,minRating){
    return service.get(`/recommendation?wine=${wine}&number=100`,{
      headers: { "X-RapidAPI-Key": '83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c' }
  }).then(res=> {
    let arrayWine=res.data.recommendedWines.map(w => ({
      ...w,
      wineType: wine,
      
    }))
    return api.postWine({arrayWine})
  })
  .catch(errHandler)

  },
}