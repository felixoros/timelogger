using System;
using System.Threading;
using System.Threading.Tasks;
using Timelogger.Api.Commands.Interfaces;
using Timelogger.Api.Enums;
using Timelogger.Api.Models;
using Timelogger.Api.Providers.Interfaces;
using Timelogger.Entities;

namespace Timelogger.Api.Commands.Classes
{
    internal sealed class CreateNewProjectCommand: ICreateNewProjectCommand
    {
        private readonly IProjectProvider _projectProvider;
        private readonly string _name;
        private readonly DateTime _deadline;

        internal CreateNewProjectCommand(IProjectProvider projectProvider, string name, DateTime deadline)
        {
            _projectProvider = projectProvider ?? throw new ArgumentNullException(nameof(projectProvider));
            _name = name ?? throw new ArgumentNullException(nameof(name));
            _deadline = deadline;
        }

        public async Task<RestResponse> Execute(CancellationToken cancellationToken = default)
        {
            await
                _projectProvider
                    .AddNewProject(new Project
                    {
                        Id = _projectProvider.GetLatestId(),
                        Name = _name,
                        WorkedTime = 0,
                        LastWorkedOn = DateTime.Now,
                        Deadline = _deadline,
                        State = ProjectState.NotStarted
                    }, cancellationToken)
                    .ConfigureAwait(false);

            await
                _projectProvider
                    .SaveChanges(cancellationToken)
                    .ConfigureAwait(false);
            
            return new RestResponse { Success = true };
        }
    }
}