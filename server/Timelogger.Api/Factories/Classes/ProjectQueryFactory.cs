using System;
using Timelogger.Api.Enums;
using Timelogger.Api.Factories.Interfaces;
using Timelogger.Api.Providers.Interfaces;
using Timelogger.Api.Queries.Classes;
using Timelogger.Api.Queries.Interfaces;

namespace Timelogger.Api.Factories.Classes
{
    public sealed class ProjectQueryFactory: IProjectQueryFactory
    {
        private readonly IProjectProvider _projectProvider;

        public ProjectQueryFactory(IProjectProvider projectProvider)
        {
            _projectProvider = projectProvider ?? throw new ArgumentNullException(nameof(projectProvider));
        }
        
        public IEnumerateAllProjectsQuery EnumerateAllProjectsQuery(SortingType sortingType) => new EnumerateAllProjectsQuery(_projectProvider, sortingType);
    }
}