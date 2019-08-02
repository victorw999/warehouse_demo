import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import ProjectSummary from "./ProjectSummary";

const ProjectListByAuthor = ({ projects }) => {
  return (
    <div className="project-list section">
      <h5 className="card-title">ProjectList By Author</h5>
      {projects &&
        projects.map(project => {
          return (
            <Link to={"/project/" + project.id} key={project.id}>
              <ProjectSummary project={project} />
            </Link>
          );
        })}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    projects: state.firestore.ordered.projects
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "projects",
      orderBy: ["authorFirstName", "desc"]
    }
  ])
)(ProjectListByAuthor);
