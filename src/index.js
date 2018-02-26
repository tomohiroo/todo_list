import React, {Component} from "react"
import ReactDOM from "react-dom"
import {BrowserRouter, Route,Redirect, Link} from 'react-router-dom'

// test
class TodoList extends Component {
  constructor(props){
    super(props)
    this.state = {
      todos: [],
      nextId: 0
    }
  }

  addTodo(text, done){
    this.setState((state) => {
      return({
        todos: [...state.todos, {text: text, done, done, id: state.nextId}],
        nextId: state.nextId + 1
      })
    })
  }
  did(id){
    let todos = this.state.todos
    todos.forEach((todo, index) => {
      if(todo.id === id){
        todos[index].done = !todos[index].done
      }
    })
    this.setState({
        todos: todos
    })
  }
  delete(id){
    this.setState((state) => ({
      //filter: trueになるやつだけ取り出す
      todos: state.todos.filter((element) => element.id !== id),
    }))
  }
  allDone(){
    let newTodos = this.state.todos
    let alldone = true
    // forEachのbreakはできない
    newTodos.forEach((todo) => {
      if (!todo.done){
          alldone = false
      }
    })
    this.setState((state) => {
      return {
        todos: state.todos.map((element) => {
          element.done = !alldone
          return element
        })
      }
    })
  }
  leftTodos(){
    return this.state.todos.filter((todo) => {return !todo.done}).length
  }
  clearComplited(){
    this.setState((state) => ({
      todos: state.todos.filter((element) => !element.done),
    }))
  }
  render() {
    return(
      <div>
        <h1>Todo List</h1>
        <TodoEntry add={(text, done) => this.addTodo(text, done)} allDone={() => this.allDone()} />
        <Route exact path="/" component={() => <TodoListItems todos={this.state.todos} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Route exact path="/active" component={() => <TodoListItems todos={this.state.todos.filter((todo) => {return (!todo.done)})} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Route exact path="/completed" component={() => <TodoListItems todos={this.state.todos.filter((todo) => {return (todo.done)})} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Footer number={this.leftTodos()} clearComplited={() => this.clearComplited()} />
      </div>
    )
  }
}

class TodoEntry extends Component{
  constructor(props){
    super(props)
    this.state = {
      text: '', done: false
    }
  }
  onChangeText(event){
    this.setState({text: event.target.value})
  }
  onClickSubmit(){
    this.props.add(this.state.text, this.state.done)
    this.setState({text: '', done: false})
  }
  render(){
    return(
      <div>
        <input type="button" value="all done" onClick={() => this.props.allDone()} />
        <input type="text" value={this.state.text} placeholder="What needs to be done?" onChange={(event) => this.onChangeText(event)} style={{width: "60%"}} />
        <input type="submit" value="add" onClick={() => this.onClickSubmit()} />
      </div>
    )
  }
}

const TodoListItems = (props) => {
  return(
    <div>
      {props.todos.map((todo, index) =>
          <TodoListItem key={index} todo={todo} did={props.did} delete={props.delete} />
      )}
    </div>
  )
}
const TodoListItem = (props) => {
    return(
      <div>
        <input type="button" onClick={() => props.did(props.todo.id)} value="○" />
        {props.todo.done ? <span style={{textDecoration: "line-through"}}>{props.todo.text}</span> : <span>{props.todo.text}</span>}
        <input type="button" onClick={() => props.delete(props.todo.id)} value="×" />
      </div>
    )
}

const Footer = (props) => {
    return (
      <div>
        <span>{props.number} items left</span>
        <Link to="/"><button>All</button></Link>
        <Link to="/active"><button>Active</button></Link>
        <Link to="/completed"><button>Completed</button></Link>
        <button onClick={() => props.clearComplited()}>Clear completed</button>
      </div>
    )
}

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={TodoList} />
  </BrowserRouter>,
  document.getElementById("app")
);
