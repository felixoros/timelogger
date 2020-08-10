using System.Runtime.Serialization;

namespace Timelogger.Api.Models
{
    [DataContract]
    public sealed class RestResponse
    {
        [DataMember] 
        public bool Success { set; get; }
    }
}