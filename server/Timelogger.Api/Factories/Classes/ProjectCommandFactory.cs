using System;
using Timelogger.Api.Commands.Classes;
using Timelogger.Api.Commands.Interfaces;
using Timelogger.Api.Factories.Interfaces;
using Timelogger.Api.Providers.Interfaces;

namespace Timelogger.Api.Factories.Classes
{
    public sealed class ProjectCommandFactory : IProjectCommandFactory
    {
        private readonly IProjectProvider _projectProvider;
        
        public ProjectCommandFactory(IProjectProvider projectProvider) {
            _projectProvider = projectProvider ?? throw new ArgumentNullException(nameof(projectProvider));
        }
        
        public ICreateNewProjectCommand CreateNewProjectCommand(string name, DateTime deadline)
            => new CreateNewProjectCommand(_projectProvider, name, deadline);
        
        public IStartProjectTimerCommand StartProjectTimerCommand(int projectId)
            => new StartProjectTimeCommand(_projectProvider, projectId);
        
        public IStopProjectTimerCommand StopProjectTimerCommand(int projectId)
            => new StopProjectTimerCommand(_projectProvider, projectId);
    }
}