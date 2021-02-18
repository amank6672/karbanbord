import React, { Component } from "react";
import "./index.css";

const generateId = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
};

export default class KanbanBoard extends Component {
  constructor() {
    super();
    // Each task is uniquely identified by its name.
    // Therefore, when you perform any operation on tasks, make sure you pick tasks by names (primary key) instead of any kind of index or any other attribute.
    this.state = {
      tasks: [],
      addNewTaskName: "",
    };
    this.stagesNames = ["Backlog", "To Do", "Ongoing", "Done"];
  }

  addNewTask = () => {
    let tempTaskList = [...this.state.tasks];
    tempTaskList.push({
      id: generateId(),
      name: this.state.addNewTaskName,
      stage: 0,
    });
    this.setState({
      ...this.state,
      tasks: tempTaskList,
    });
  };

  handleTaskNameChange = (e) => {
    let name = e.target.value;
    this.setState({
      ...this.state,
      addNewTaskName: name,
    });
  };

  deleteTask = (id) => {
    let tempTaskList = [...this.state.tasks];
    tempTaskList = tempTaskList.filter((task) => task.id != id);
    this.setState({
      ...this.state,
      tasks: tempTaskList,
    });
  };

  handleTaskMoveOperation = (task, isPrevClicked) => {
    let tempTaskList = [...this.state.tasks];
    if (isPrevClicked) {
      if (task.stage <= 0) {
        return;
      } else {
        task = {
          ...task,
          stage: task.stage - 1,
        };
      }
    } else {
      if (task.stage >= 3) {
        return;
      } else {
        task = {
          ...task,
          stage: task.stage + 1,
        };
      }
    }
    tempTaskList = tempTaskList.map((it) => {
      if (it?.id == task?.id) {
        return task;
      }
      return it;
    });
    this.setState({
      ...this.state,
      tasks: tempTaskList,
    });
  };

  render() {
    const { tasks } = this.state;

    let stagesTasks = [];
    for (let i = 0; i < this.stagesNames.length; ++i) {
      stagesTasks.push([]);
    }
    for (let task of tasks) {
      const stageId = task.stage;
      stagesTasks[stageId].push(task);
    }

    return (
      <div className="mt-20 layout-column justify-content-center align-items-center">
        <section className="mt-50 layout-row align-items-center justify-content-center">
          <input
            id="create-task-input"
            type="text"
            className="large"
            placeholder="New task name"
            data-testid="create-task-input"
            value={this.addNewTaskName}
            onChange={this.handleTaskNameChange}
          />
          <button
            type="submit"
            className="ml-30"
            data-testid="create-task-button"
            onClick={this.addNewTask}
          >
            Create task
          </button>
        </section>

        <div className="mt-50 layout-row">
          {stagesTasks.map((tasks, i) => {
            return (
              <div className="card outlined ml-20 mt-0" key={`${i}`}>
                <div className="card-text">
                  <h4>{this.stagesNames[i]}</h4>
                  <ul className="styled mt-50" data-testid={`stage-${i}`}>
                    {tasks.map((task, index) => {
                      return (
                        <li className="slide-up-fade-in" key={`${i}${index}`}>
                          <div className="li-content layout-row justify-content-between align-items-center">
                            <span
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-name`}
                            >
                              {task.name}
                            </span>
                            <div className="icons">
                              <button
                                className="icon-only x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-back`}
                                disabled={task.stage == 0}
                                onClick={() => {
                                  this.handleTaskMoveOperation(task, true);
                                }}
                              >
                                <i className="material-icons">arrow_back</i>
                              </button>
                              <button
                                className="icon-only x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-forward`}
                                disabled={
                                  task.stage == this.stagesNames.length - 1
                                }
                                onClick={() => {
                                  this.handleTaskMoveOperation(task, false);
                                }}
                              >
                                <i className="material-icons">arrow_forward</i>
                              </button>
                              <button
                                className="icon-only danger x-small mx-2"
                                data-testid={`${task.name
                                  .split(" ")
                                  .join("-")}-delete`}
                                onClick={() => {
                                  this.deleteTask(task?.id);
                                }}
                              >
                                <i className="material-icons">delete</i>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
