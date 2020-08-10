using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Timelogger.Api.Enums;
using Timelogger.Entities;

namespace Timelogger.Api.Providers.Interfaces
{
    public interface IProjectProvider
    {
        public Task<int> SaveChanges(CancellationToken cancellationToken);
        public int GetLatestId();
        public Task<IEnumerable<Project>> GetAll(SortingType sortingType, CancellationToken cancellationToken = default);
        public Task<Project> GetProjectById(int projectId, CancellationToken cancellationToken = default);
        public Task<EntityEntry<Project>> AddNewProject(Project project, CancellationToken cancellationToken = default);
    }
}