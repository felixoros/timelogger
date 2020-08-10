using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Timelogger.Api.Enums;
using Timelogger.Api.Factories.Classes;
using Timelogger.Api.Factories.Interfaces;
using Timelogger.Entities;

namespace Timelogger.Api
{
	public class Startup
	{
		private readonly IHostingEnvironment _environment;
		public IConfigurationRoot Configuration { get; }

		public Startup(IHostingEnvironment env)
		{
			_environment = env;

			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddEnvironmentVariables();
			Configuration = builder.Build();
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			// Add framework services.
			services.AddDbContext<ApiContext>(opt => opt.UseInMemoryDatabase());

			if (_environment.IsDevelopment())
			{
				services.AddCors();
			}
			
			services.AddMvc();
			
			var serviceProvider = services.BuildServiceProvider();
			var apiContext = serviceProvider.GetService<ApiContext>();
			
			IProviderFactory providerFactory = new ProviderFactory(apiContext);
			services.AddSingleton(providerFactory.ProjectProvider);
			
			services.AddSingleton<IProjectCommandFactory, ProjectCommandFactory>();
			services.AddSingleton<IProjectQueryFactory, ProjectQueryFactory>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			if (env.IsDevelopment())
			{
				app.UseCors(builder => builder
					.AllowAnyOrigin()
					.AllowAnyMethod()
					.AllowAnyHeader()
					.AllowCredentials());
			}

			app.UseMvc();

			// Seed "database" with example data
			var context = app.ApplicationServices.GetService<ApiContext>();
			AddExampleData(context);
		}

		private static void AddExampleData(ApiContext context)
		{
			var testProject1 = new Project
			{
				Id = 1,
				Name = "e-conomic Interview",
				WorkedTime = 1,
				LastWorkedOn = DateTime.UtcNow,
				Deadline = DateTime.UtcNow,
				State = ProjectState.NotStarted,
			};
			
			var testProject2 = new Project
			{
				Id = 2,
				Name = "My extra project",
				WorkedTime = 30,
				LastWorkedOn = DateTime.UtcNow,
				Deadline = DateTime.UtcNow.AddDays(4),
				State = ProjectState.Finished,
			};
			
			var testProject3 = new Project
			{
				Id = 3,
				Name = "Some website",
				WorkedTime = 31,
				LastWorkedOn = DateTime.UtcNow,
				Deadline = DateTime.UtcNow.AddDays(3),
				State = ProjectState.Ongoing,
			};
			
			var testProject4 = new Project
			{
				Id = 4,
				Name = "My active project",
				WorkedTime = 80,
				LastWorkedOn = DateTime.UtcNow.AddDays(-1),
				Deadline = DateTime.UtcNow.AddDays(2),
				State = ProjectState.Active,
			};
			

			context.Projects.Add(testProject1);
			context.Projects.Add(testProject2);
			context.Projects.Add(testProject3);
			context.Projects.Add(testProject4);
			
			context.SaveChanges();
		}
	}
}
