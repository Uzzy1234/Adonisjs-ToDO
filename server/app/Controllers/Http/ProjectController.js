'use strict'
const Project = use('App/Models/Project')
const AuthorizationService = use('App/Services/AuthorizationService')
const InvalidAccessException = use('App/Exceptions/InvalidAccessException')

class ProjectController {
  async index({ response, request, auth }) {
    const user = await auth.getUser()
    const user_projects = await user.projects().fetch()
    return response.status(200).json({
      status: "success",
      data: user_projects
    })
  }

  async create({ auth, request }) {
    const user = await auth.getUser()
    const { title } = request.all()
    const project = new Project()
    project.title = title
    await user.projects().save(project)
    return project

  }

  async destroy({ response, auth, request, params }) {
    const user = await auth.getUser()
    const project = await Project.find(params.id)
    AuthorizationService.verifyPermission(project, user)
    project.delete()
    return response.status(200).json({
      status: "success",
      data: project
    })
  }

  async update({ response, auth, request, params }) {
    const user = await auth.getUser()
    const project = await Project.find(params.id)
    AuthorizationService.verifyPermission(project, user)
    project.merge(request.only('title'))
    await project.save()
    return response.status(200).json({
      status: "success",
      data: project
    })
  }
}

module.exports = ProjectController
