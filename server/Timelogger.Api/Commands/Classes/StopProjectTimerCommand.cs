using System;
using System.Threading;
using System.Threading.Tasks;
using Timelogger.Api.Commands.Interfaces;
using Timelogger.Api.Enums;
using Timelogger.Api.Models;
using Timelogger.Api.Providers.Interfaces;

namespace Timelogger.Api.Commands.Classes
{
    internal sealed class StopProjectTimerCommand : IStopProjectTimerCommand
    {
        private readonly IProjectProvider _projectProvider;
        private readonly int _projectId;

        public StopProjectTimerCommand(IProjectProvider projectProvider, int projectId)
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


            var diffDate = project.LastWorkedOn.Subtract(DateTime.UtcNow);
            var diffMinutes = Math.Abs(diffDate.TotalMinutes);
            
            if (diffMinutes < 30)
                throw new Exception("Timer stop operation it's not allowed before 30 minutes of active time");
            
            var workedTime = Convert.ToInt32(project.WorkedTime + diffMinutes);

            project.WorkedTime = workedTime;
            project.LastWorkedOn = DateTime.UtcNow;
            project.State = ProjectState.Ongoing;
            
            await
                _projectProvider
                    .SaveChanges(cancellationToken)
                    .ConfigureAwait(false);
            
            return new RestResponse { Success = true };
        }
    }
}