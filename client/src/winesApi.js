import axios from 'axios'

const winesApi = axios.create({
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
  winesApi: winesApi,
  //get the three wines based on the food provided
  getWinesGeneral(food){
    return winesApi.get(`/pairing?maxPrice=1000000000&food=${food}`,{
      headers: { "X-RapidAPI-Key":  '58a43d5ad7mshf95a9a31e4661dbp1c44fajsn267461ee1adc' }
  }).then(res=>res)
  .catch(errHandler)

  },

  getWineReccomendation(wine,maxPrice){
    return winesApi.get(`/recommendation?maxPrice=${maxPrice}&minRating=0.7&number=3&wine=${wine}`,{
      headers: { "X-RapidAPI-Key":  '58a43d5ad7mshf95a9a31e4661dbp1c44fajsn267461ee1adc' }
  }).then(res=>res)
  .catch(errHandler)

  }
}