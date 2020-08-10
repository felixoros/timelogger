using System;
using Timelogger.Api.Commands.Interfaces;

namespace Timelogger.Api.Factories.Interfaces
{
    public interface IProjectCommandFactory
    {
        public ICreateNewProjectCommand CreateNewProjectCommand(string name, DateTime deadline);
        public IStartProjectTimerCommand StartProjectTimerCommand(int projectId);
        public IStopProjectTimerCommand StopProjectTimerCommand(int projectId);
    }
}