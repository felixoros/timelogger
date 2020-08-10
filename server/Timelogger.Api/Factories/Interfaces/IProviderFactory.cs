using Timelogger.Api.Providers.Interfaces;

namespace Timelogger.Api.Factories.Interfaces
{
    internal interface IProviderFactory
    {
        public IProjectProvider ProjectProvider { get; }
    }
}