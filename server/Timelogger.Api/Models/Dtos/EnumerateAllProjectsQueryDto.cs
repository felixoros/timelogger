using System.Collections.Generic;
using System.Runtime.Serialization;
using Timelogger.Entities;

namespace Timelogger.Api.Models.Dtos
{
    [DataContract]
    public sealed class EnumerateAllProjectsQueryDto
    {
        [DataMember]
        public IEnumerable<Project> Entries { set; get; }
    }
}