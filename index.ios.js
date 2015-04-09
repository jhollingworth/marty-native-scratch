/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';




var React = require('react-native');
var Marty = require('marty-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var UserAPI = Marty.createStateSource({
  type: 'http',
  id: 'UserAPI',
  getUser(userId) {
    return this.get('http://jsonplaceholder.typicode.com/users/' + userId);
  }
});

var UserQueries = Marty.createQueries({
  id: 'UserQueries',
  getUser(userId) {
    return UserAPI.getUser(userId).then((res) => {
      return res.json().then((user) => {
        this.dispatch("ADD_USER", user);
      });
    });
  }
});

var SomeStore = Marty.createStore({
  handlers: {
    "addUser": "ADD_USER"
  },
  getUser(userId) {
    return this.fetch({
      id: userId,
      locally() {
        return this.state[userId];
      },
      remotely() {
        return UserQueries.getUser(userId);
      }
    })
  },
  addUser(user) {
    this.state[user.id] = user;
    this.hasChanged();
  }
});


var Test = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.props.user.name}
        </Text>
      </View>
    );
  }
});

var TestContainer = Marty.createContainer(Test, {
  listenTo: SomeStore,
  fetch: {
    user() {
      return SomeStore.getUser(1)
    }
  },
  failed(errors) {
    console.error(errors);
  },
  pending() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Waiting
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Test', () => TestContainer);
