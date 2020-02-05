import React, { Component, createContext, useContext } from 'react';
import { ipcRenderer } from 'electron';
import { DownloadManagerContext } from './downloadManager';

export const TasksContext = createContext();
export const useTasks = () => useContext(TasksContext);

class TasksProvider extends Component {
  static contextType = DownloadManagerContext;

  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
      lastTask: {},
      add: this.add,
    };

    ipcRenderer.on('autoUpdater', (e, { status, releaseName }) => {
      const { tasks } = this.state;
      switch (status) {
        case 'checkingUpdate':
          this.add({ name: 'Checking for update', status: 'running', section: 'Settings' });
          break;
        case 'noUpdateAvailable':
          if (tasks['Checking for update']) tasks['Checking for update'].terminate();
          break;
        case 'updateAvailable':
          if (tasks['Checking for update']) tasks['Checking for update'].terminate();
          this.add({ name: 'Downloading update', status: 'running', section: 'Settings' });
          break;
        case 'updateDownloaded':
          if (tasks['Downloading update']) tasks['Downloading update'].terminate();
          this.add({
            name: `Version ${releaseName} ready`,
            status: 'running',
            section: 'Settings',
            description: 'You can now restart the app',
          });
          break;
        default:
          break;
      }
    });
  }

  componentWillUpdate() {
    const { tasks } = this.state;
    const { overallProgress, queue } = this.context;
    if (this.context.currentDownload) {
      if (!tasks['Downloading'])
        return this.add({ name: 'Downloading', status: 'running', description: `initializing`, section: 'Downloads' });
      const description = `${Math.round(overallProgress * 100)}% - ${queue.length} items in queue`;
      if (tasks['Downloading'].description !== description) {
        tasks['Downloading'].description = description;
        this.setState({ tasks });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasks } = this.state;
    const { queue, currentDownload } = this.context;

    if (!currentDownload && !queue.length) {
      if (tasks['Downloading']) tasks['Downloading'].terminate();
    }
  }

  add = task => {
    task.terminate = newDescription => {
      const { tasks } = this.state;
      delete tasks[task.name];
      task.status = 'terminated';
      if (newDescription) task.description = newDescription;
      this.setState({ lastTask: task, tasks });
    };
    const { tasks } = this.state;
    tasks[task.name] = task;
    this.setState({ tasks });
    return task;
  };

  render() {
    const { children } = this.props;
    return <TasksContext.Provider value={this.state}>{children}</TasksContext.Provider>;
  }
}

export default TasksProvider;