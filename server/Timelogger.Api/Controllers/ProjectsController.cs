using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Timelogger.Api.Enums;
using Timelogger.Api.Factories.Interfaces;

namespace Timelogger.Api.Controllers
{
	[Route("api/[controller]")]
	public class ProjectsController : Controller
	{
		private readonly IProjectCommandFactory _projectCommandFactory;
		private readonly IProjectQueryFactory _projectQueryFactory;
		
		public ProjectsController(
			IProjectCommandFactory projectCommandFactory,
			IProjectQueryFactory projectQueryFactory)
		{
			_projectCommandFactory = projectCommandFactory ?? throw new ArgumentNullException(nameof(projectCommandFactory));
			_projectQueryFactory = projectQueryFactory ?? throw new ArgumentNullException(nameof(projectQueryFactory));
		}
		
		[HttpGet("{sortingType}")]
		public async Task<IActionResult> GetAll(string sortingType, CancellationToken cancellationToken = default)
		{
			cancellationToken.ThrowIfCancellationRequested();

			if(string.IsNullOrEmpty(sortingType))
				throw new Exception("Invalid sorting type");
			
			var parsedSortingType = (SortingType) Enum.Parse(typeof(SortingType), sortingType);
			
			return Ok(
				await 
					_projectQueryFactory
						.EnumerateAllProjectsQuery(parsedSortingType)
						.Execute(cancellationToken)
						.ConfigureAwait(false)
				);
		}
		
		[HttpPost("new/{name}/{deadline}")]
		public async Task<IActionResult> CreateNewProject(string name, string deadline, CancellationToken cancellationToken = default)
		{
			cancellationToken.ThrowIfCancellationRequested();

			if (string.IsNullOrEmpty(name))
				throw new Exception("Invalid project name");

			if (string.IsNullOrEmpty(deadline))
				throw new Exception("Invalid project deadline");

			var parsedDeadLine = DateTime.Parse(deadline);
			parsedDeadLine = parsedDeadLine.ToUniversalTime();

			return Ok(
				await
					_projectCommandFactory
						.CreateNewProjectCommand(name, parsedDeadLine)
						.Execute(cancellationToken)
						.ConfigureAwait(false)
			);
		}

		[HttpPost("start/{projectId}")]
		public async Task<IActionResult> StartProjectTimer(string projectId, CancellationToken cancellationToken = default)
		{
			cancellationToken.ThrowIfCancellationRequested();
			
			if (string.IsNullOrEmpty(projectId))
				throw new Exception("Invalid project identifier");

			var parsedProjectId = Int32.Parse(projectId);
			
			return Ok(
				await
					_projectCommandFactory
						.StartProjectTimerCommand(parsedProjectId)
						.Execute(cancellationToken)
						.ConfigureAwait(false)
			);
		}
		
		[HttpPost("stop/{projectId}")]
		public async Task<IActionResult> StopProjectTimer(string projectId, CancellationToken cancellationToken = default)
		{
			cancellationToken.ThrowIfCancellationRequested();
			
			if (string.IsNullOrEmpty(projectId))
				throw new Exception("Invalid project identifier");

			var parsedProjectId = Int32.Parse(projectId);
			
			return Ok(
				await
					_projectCommandFactory
						.StopProjectTimerCommand(parsedProjectId)
						.Execute(cancellationToken)
						.ConfigureAwait(false)
			);
		}
	}
}
