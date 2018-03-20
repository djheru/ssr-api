import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTodos } from '../actions';
import requireAuth from '../hocs/requireAuth';

class TodosPage extends Component {
  componentDidMount() {
    this.props.fetchTodos();
  }

  renderTodos() {
    return this.props.todos.map(({ _id, name }) => (<li key={ _id }>{ name }</li>));
  }

  render() {
    return (
      <div>
        <h3>Protected list of todos</h3>
        <ul>{ this.renderTodos() }</ul>
      </div>
    )
  }
}

// const mapStateToProps = ({ todos }) => ({ todos });
const mapStateToProps = (state) => {
  return {todos: state.todos || []};
};

export default {
  component: connect(mapStateToProps, { fetchTodos })(requireAuth(TodosPage)),
  loadData: ({ dispatch }) => dispatch(fetchTodos())
};
