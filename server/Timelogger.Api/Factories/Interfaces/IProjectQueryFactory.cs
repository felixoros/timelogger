using Timelogger.Api.Enums;
using Timelogger.Api.Queries.Interfaces;

namespace Timelogger.Api.Factories.Interfaces
{
    public interface IProjectQueryFactory
    {
        public IEnumerateAllProjectsQuery EnumerateAllProjectsQuery(SortingType sortingType);
    }
}