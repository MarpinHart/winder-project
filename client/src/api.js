import axios from 'axios'

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
  service: service,

  // This method is synchronous and returns true or false
  // To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
  isLoggedIn() {
    return localStorage.getItem('user') != null
  },

  // This method returns the user from the localStorage
  // Be careful, the value is the one when the user logged in for the last time
  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  // This method signs up and logs in the user
  signup(userInfo) {
    return service
      .post('/signup', userInfo)
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  login(email, password) {
    return service
      .post('/login', {
        email,
        password,
      })
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  getConnectedProfile(){
    return service
      .get('/connected-profile')
      .then(res => {
        let user = res.data
        localStorage.setItem('user', JSON.stringify(user))
        return user
      })
  },

  logout() {
    localStorage.removeItem('user')
    return service
      .get('/logout')
  },

  // This is an example on how to use this method in a different file
  // api.getCountries().then(countries => { /* ... */ })
  editName(userId, newName) {
    return service
      .put('/profile/'+userId, {newName})
      .then(res => res.data)
      .catch(errHandler)
  },
  getUser(id){
    return service
      .get('/profile/'+id)
      .then(res => res.data)
      .catch(errHandler)
  },
  postFood(food) {
    return service  
      .post('/foods', food)
      .then(res => res)
      .catch(errHandler)
  },
  postWine(wine) {
    return service
      .post('/wines', wine)
      .then(res => res.data)
      .catch(errHandler)
  },
  getWinesDetail(wine,maxPrice,minRating){
    return service
    .get(`/wines?wine=${wine}&maxPrice=${maxPrice}&minRating=${minRating}`)
    .then(res=>res)
    .catch(err=>console.log(err))
  },
  getPairedWines(foodName){
    return service
    .get(`/foods/${foodName}`)
     .then(res=>res)
     .catch(err=>console.log(err))
  },
  postSavedWine(_wine){
    return service
    .post(`/saved-wines`,{_wine})
    .then(res=>res)
    .catch(err=>console.log(err))
  },
  getSavedWinesByUser(query){
    if(!query){
      query=''
    }
    return service
    .get('/saved-wines'+query)
    .then(res=>res)
    .catch(err=>console.log(err))
  },
  deleteSavedWineByUser(_wine){
    return service
    .delete('/saved-wines',{_wine})
    .then(res=>res)
    .catch(err=>console.log(err))
  },
  getFoods(query){
    return service
    .get(`/foods`)
    .then(res=>res)
    .catch(err=>console.log(err))
  },
  likeWine(idSaving,type){
    console.log('type', type)
    return service
    .put('/saved-wines',{idSaving, type})
    .then(res=>res)
    .catch(err=>console.log(err))
  }

}
