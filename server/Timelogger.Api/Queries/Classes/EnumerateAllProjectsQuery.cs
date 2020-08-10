using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Timelogger.Api.Enums;
using Timelogger.Api.Models.Dtos;
using Timelogger.Api.Providers.Interfaces;
using Timelogger.Api.Queries.Interfaces;

namespace Timelogger.Api.Queries.Classes
{
    internal sealed class EnumerateAllProjectsQuery: IEnumerateAllProjectsQuery
    {
        private readonly IProjectProvider _projectProvider;
        private readonly SortingType _sortingType;
        
        internal EnumerateAllProjectsQuery(IProjectProvider projectProvider, SortingType sortingType)
        {
            _projectProvider = projectProvider ?? throw new ArgumentNullException(nameof(projectProvider));
            _sortingType = sortingType;
        }

        public async Task<EnumerateAllProjectsQueryDto> Execute(CancellationToken cancellationToken = default)
        {
            var projects =
                await
                    _projectProvider
                        .GetAll(_sortingType, cancellationToken)
                        .ConfigureAwait(false);
                
            return new EnumerateAllProjectsQueryDto{ Entries = projects.ToList() };
        }
    }
}