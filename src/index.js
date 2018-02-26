import React, {Component} from "react"
import ReactDOM from "react-dom"
import {BrowserRouter, Route,Redirect, Link} from 'react-router-dom'

class TodoList extends Component {
  constructor(props){
    super(props)
    this.state = {
      todos: [],
      nextId: 0,
      value: ""
    }
  }

  addTodo(text){
    this.setState((state) => {
      return({
        todos: [...state.todos, {text: text, done: false, id: state.nextId}],
        nextId: state.nextId + 1,
        value: ""
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
  handleChange(event){
    this.setState({
      value: event.target.value
    })
  }
  render() {
    return(
      <div>
        <h1>Todo List</h1>
        <TodoEntry add={(text) => this.addTodo(text)} allDone={() => this.allDone()} value={this.state.value} onChangeText={(event) => this.handleChange(event)}/>
        <Route exact path="/" component={() => <TodoListItems todos={this.state.todos} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Route exact path="/active" component={() => <TodoListItems todos={this.state.todos.filter((todo) => {return (!todo.done)})} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Route exact path="/completed" component={() => <TodoListItems todos={this.state.todos.filter((todo) => {return (todo.done)})} did={(id) => this.did(id)} delete={(id) => this.delete(id)} />}/>
        <Footer number={this.leftTodos()} clearComplited={() => this.clearComplited()} />
      </div>
    )
  }
}

const TodoEntry = (props) => {
  return(
    <div>
      <input type="button" value="all done" onClick={() => props.allDone()} />
      <input type="text" value={props.value} placeholder="What needs to be done?" onChange={(event) => props.onChangeText(event)} style={{width: "60%"}} />
      <input type="submit" value="add" onClick={() => props.add(props.value)} />
    </div>
  )
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
