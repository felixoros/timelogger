using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Timelogger.Api.Enums;
using Timelogger.Api.Providers.Interfaces;
using Timelogger.Entities;

namespace Timelogger.Api.Providers.Classes
{
    internal sealed class ProjectProvider: IProjectProvider
    {
        private readonly ApiContext _apiContext;
        
        public ProjectProvider(ApiContext apiContext)
        {
            _apiContext = apiContext ?? throw new ArgumentNullException(nameof(apiContext));
        }
        
        public int GetLatestId()
        {
            var lastProject = _apiContext.Projects.LastOrDefault();

            if (lastProject != null)
                return lastProject.Id + 1;
            
            return 0;
        }

        public async Task<int> SaveChanges(CancellationToken cancellationToken = default)
            =>
                await _apiContext
                    .SaveChangesAsync(cancellationToken)
                    .ConfigureAwait(false);

        public async Task<IEnumerable<Project>> GetAll(SortingType sortingType, CancellationToken cancellationToken = default){
            var projects = 
                await _apiContext.Projects
                    .ToListAsync(cancellationToken)
                    .ConfigureAwait(false);
            
            if (sortingType == SortingType.AscendingByDeadline)
            {
                projects.Sort((a, b) => a.Deadline.CompareTo(b.Deadline) );
            }
            
            return projects.AsEnumerable();
        }

        public Task<Project> GetProjectById(int projectId, CancellationToken cancellationToken = default) 
            => _apiContext.Projects.SingleOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        
        public Task<EntityEntry<Project>> AddNewProject(Project project, CancellationToken cancellationToken = default) 
            => _apiContext.Projects.AddAsync(project, cancellationToken);
    }
}