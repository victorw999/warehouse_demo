import React, { Component } from "react";

// Database Ref
import Firebase from "../../Config/Firebase";

// Stylesheet
import "../View-Styles/views.scss";

// Componenents
import Post from "../../Components/Post/Post";
import EntryForm from "../../Components/EntryForm/EntryForm";

export class Gym extends Component {
  constructor() {
    super();

    this.collection = "Gym";

    this.app = Firebase;
    this.db = this.app.firestore().collection("Gym");

    this.state = {
      posts: []
    };

    this.addNote = this.addNote.bind(this);
  }

  componentDidMount() {
    this.currentPosts = this.state.posts;

    this.db.onSnapshot(snapshot => {
      snapshot.docs.forEach(doc => {
        this.currentPosts.push({
          id: doc.id,
          // title: doc.data().title,
          body: doc.data().body
        });
      });

      this.setState({
        posts: this.currentPosts
      });
    });
  }

  addNote(post) {
    // console.log('post content:', post );
    this.db.add({
      body: post
    });
  }

  render() {
    return (
      <div className="view-body">
        <div>
          {this.state.posts.map(post => {
            return (
              <div className="post">
                <Post
                  key={post.id}
                  postId={post.id}
                  postTitle={post.title}
                  postBody={post.body}
                />
              </div>
            );
          })}
        </div>
        <div className="entry-form">
          <EntryForm addNote={this.addNote} collection={this.collection} />
        </div>
      </div>
    );
  }
}

export default Gym;
