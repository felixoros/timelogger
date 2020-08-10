using System;
using Timelogger.Api.Enums;

namespace Timelogger.Entities
{
	public sealed class Project
	{
		public int Id { get; set; }
		public string Name { get; set; }
		
		public long WorkedTime { get; set; }
		
		public DateTime LastWorkedOn { get; set; }
		
		public DateTime Deadline { get; set; }
		
		public ProjectState State { get; set; }
	}
}
