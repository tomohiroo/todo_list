import React, {Component} from "react"
import ReactDOM from "react-dom"
import {BrowserRouter, Route,Redirect, Link} from 'react-router-dom'

class TodoList extends Component {
  constructor(props){
    super(props)
    this.state = {
      todos: [],
      nextId: 0
    }
  }

  addTodo(text, done){
    const todo = {text: text, done: done, id: this.state.nextId}
    const todos = this.state.todos.concat(todo)
    let n = this.state.nextId
    n++
    this.setState({todos: todos, nextId: n})
  }
  iDo(id){
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
    newTodos.forEach((todo) => {
      todo.done = !alldone
    })
    this.setState({
      todos: newTodos
    })
  }
  leftTodos(){
    let count = 0;
    this.state.todos.forEach((todo) => {
      if(!todo.done){
        count++
      }
    })
    return count
  }
  clearComplited(){
    this.setState((state) => ({
      todos: state.todos.filter((element) => element.done == false),
    }))
    // this.setState((state) => ({
    //   todos: state.todos.filter((element) => !element.done),
    // }))
  }
  render() {
    return(
      <div>
        <h1>Todo List</h1>
        <TodoEntry add={(text, done) => this.addTodo(text, done)} allDone={() => this.allDone()} />
        <Route exact path="/" component={() => <TodoListItems todos={this.state.todos} iDo={(id) => this.iDo(id)} delete={(id) => this.delete(id)} />}/>
        <Route path="/active" component={() => <TodoListActiveItems todos={this.state.todos} iDo={(id) => this.iDo(id)} delete={(id) => this.delete(id)} />}/>
        <Route path="/completed" component={() => <TodoListCompletedItems todos={this.state.todos} iDo={(id) => this.iDo(id)} delete={(id) => this.delete(id)} />}/>
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
          <TodoListItem key={index} todo={todo} iDo={props.iDo} delete={props.delete} />
      )}
    </div>
  )
}
const TodoListItem = (props) => {
  // returnは一つの要素しかラップできない
    return(
      <div>
        <input type="button" onClick={() => props.iDo(props.todo.id)} value="○" />
        {props.todo.done ? <span style={{textDecoration: "line-through"}}>{props.todo.text}</span> : <span>{props.todo.text}</span>}
        <input type="button" onClick={() => props.delete(props.todo.id)} value="×" />
      </div>
    )
}

const TodoListActiveItems = (props) => {
  const todos = props.todos.filter((element) => !element.done)
  return(
    <div>
      {todos.map((todo, index) =>
          <TodoListItem key={index} todo={todo} iDo={props.iDo} delete={props.delete} />
      )}
    </div>
  )
}

const TodoListCompletedItems = (props) => {
  const todos = props.todos.filter((element) => element.done)
  return(
    <div>
      {todos.map((todo, index) =>
          <TodoListItem key={index} todo={todo} iDo={props.iDo} delete={props.delete} />
      )}
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
