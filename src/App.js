
import './App.css';
import React,{ Component } from 'react'

import { PaginationTable } from './PaginationTable'

import './bootstrap.min.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      items:[],
      isLoaded: false,
    }
  }

  componentDidMount(){
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
       targetUrl = 'https://api.itbook.store/1.0/search/mongodb';
    
       fetch(targetUrl)
       .then(blob => blob.json())
       .then(data => {
        this.setState({
          isLoaded:true,
          items:data.books,
        })
         console.log("los libros son ",data.books);
         //document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
         return data;
       })
       .catch(e => {
         console.log(e);
         return e;
       });
  }

  
  render() {
    
    var { isLoaded ,items } = this.state;
    console.log("asdasdasasdadsdadsa",items)
    
    return(
    <div class="container" className='App'>
      <div class="row">
      
      <PaginationTable class="col-6" items={items}/>
    </div>
       
    </div>
    )
  };
}

export default App;
