'use strict'

const Project = use('App/Models/Project')
const Task = use('App/Models/Task')
const AuthorizationService = use('App/Services/AuthorizationService')

class TaskController {
  async create({ auth, request, params }) {
    const user = await auth.getUser()
    const { description } = request.all()
    const project_id = await Project.find(params.id)
    AuthorizationService.verifyPermission(project_id, user)
    const task = new Task()
    task.description = description
    await project_id.tasks().save(task)
    return task
  }

  async index({ auth, params, response}) {
    const user = await auth.getUser()
    const project_id = await Project.find(params.id)
    AuthorizationService.verifyPermission(project_id, user)
    const project_tasks = await project_id.tasks().fetch()
    console.log(project_tasks)
    return response.status(200).json({
      status: "success",
      data: project_tasks
    })
  }

  async update({ response, auth, request, params }) {
    const user = await auth.getUser()
    const task = await Task.find(params.id)
    const project_tasks = await task.project().fetch()
    AuthorizationService.verifyPermission(project_tasks, user)
    task.merge(request.only(['description', 'completed']))
    await task.save()
    return response.status(200).json({
      status: "success",
      data: task
    })
  }

  async destroy({ response, auth, request, params }) {
    const user = await auth.getUser()
    const task = await Task.find(params.id)
    const project_tasks = await task.project().fetch()
    AuthorizationService.verifyPermission(project_tasks, user)
    task.delete()
    return response.status(200).json({
      status: "success",
      data: task
    })
  }
}

module.exports = TaskController
