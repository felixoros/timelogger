using System.Threading;
using System.Threading.Tasks;

namespace Timelogger.Api.Queries
{
    public interface IQuery<T>
    {
        Task<T> Execute(CancellationToken cancellationToken = default);
    }
}