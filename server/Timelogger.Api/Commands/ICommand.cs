using System.Threading;
using System.Threading.Tasks;

namespace Timelogger.Api.Commands
{
    public interface ICommand <T>
    {
        public Task<T> Execute(CancellationToken cancellationToken = default);
    }
}