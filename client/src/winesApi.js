import axios from 'axios'
//federicokey 83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c
//juliakey 58a43d5ad7mshf95a9a31e4661dbp1c44fajsn267461ee1adc
const winesApi = axios.create({
  baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine',
  withCredentials: false
})

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true
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
  winesApi: winesApi,
  service: service,
  
  //get the three wines based on the food provided
  getWinesGeneral(food){
    return winesApi.get(`/pairing?maxPrice=1000000000&food=${food}`,{
      headers: { "X-RapidAPI-Key":  '83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c' }
  }).then(res=>res.data)
    .catch(errHandler)
  },

  getWineReccomendation(wine,maxPrice,minRating){
    return winesApi.get(`/recommendation?maxPrice=${maxPrice}&minRating=${minRating}&number=3&wine=${wine}`,{
      headers: { "X-RapidAPI-Key":  '83cd5eea93msh7a21ffe38ad05acp1b6b9djsn453f8ffb948c' }
  }).then(res=>res)
  .catch(errHandler)

  },
}