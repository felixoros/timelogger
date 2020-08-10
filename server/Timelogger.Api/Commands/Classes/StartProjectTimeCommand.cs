using System;
using System.Threading;
using System.Threading.Tasks;
using Timelogger.Api.Commands.Interfaces;
using Timelogger.Api.Enums;
using Timelogger.Api.Models;
using Timelogger.Api.Providers.Interfaces;

namespace Timelogger.Api.Commands.Classes
{
    internal sealed class StartProjectTimeCommand: IStartProjectTimerCommand
    {
        private readonly IProjectProvider _projectProvider;
        private readonly int _projectId;

        internal StartProjectTimeCommand(IProjectProvider projectProvider, int projectId)
        {
            _projectProvider = projectProvider ?? throw new ArgumentNullException(nameof(projectProvider));
            _projectId = projectId;
        }

        public async Task<RestResponse> Execute(CancellationToken cancellationToken = default)
        {
            var project =
                await _projectProvider
                    .GetProjectById(_projectId, cancellationToken)
                    .ConfigureAwait(false);
            
            if (project == null)
                throw new Exception("Given project it does not exists in database");

            project.State = ProjectState.Active;
            project.LastWorkedOn = DateTime.UtcNow;

            await
                _projectProvider
                    .SaveChanges(cancellationToken)
                    .ConfigureAwait(false);
            
            return new RestResponse { Success = true };
        }
    }
}